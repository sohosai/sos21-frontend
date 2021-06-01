import { useEffect, useState } from "react"

import { PageFC } from "next"
import { useRouter } from "next/router"

import { useForm, useFieldArray } from "react-hook-form"

import { useAuthNeue } from "src/contexts/auth"
import { useMyProject } from "src/contexts/myProject"
import { useToastDispatcher } from "src/contexts/toast"

import { RegistrationForm } from "src/types/models/registrationForm"
import { FormAnswerItemInForm } from "src/types/models/form/answerItem"

import { getRegistrationForm } from "src/lib/api/registrationForm/getRegistrationForm"
import { answerRegistrationForm } from "src/lib/api/registrationForm/answerRegistrationForm"

import { pagesPath } from "src/utils/$path"
import { attachError } from "src/utils/attachError"

import { Button, FormItemSpacer, Head, Panel, Spinner } from "src/components"
import {
  IntegerFormItem,
  RadioFormItem,
  TextFormItem,
} from "src/components/FormItem"

import styles from "./[id].module.scss"

type Inputs = {
  items: FormAnswerItemInForm[]
}

const AnswerRegistrationForm: PageFC = () => {
  const { authState } = useAuthNeue()
  const { myProjectState } = useMyProject()
  const { addToast } = useToastDispatcher()
  const router = useRouter()

  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>()
  const [generalError, setGeneralError] =
    useState<"noProject" | "noRegistrationFormId">()
  const [processing, setProcessing] = useState(false)

  const { id: registrationFormId } = router.query as { id?: string }

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    mode: "onBlur",
    criteriaMode: "all",
    shouldFocusError: true,
    defaultValues: {
      items: [],
    },
  })

  const { append } = useFieldArray({
    control,
    name: "items",
  })

  const onSubmit = async ({ items }: Inputs) => {
    // useEffect 側でハンドルしてるので適当
    if (authState?.status !== "bothSignedIn") return
    if (!myProjectState?.myProject) return
    if (!registrationFormId) return

    if (window.confirm("回答を送信しますか?")) {
      setProcessing(true)

      const requestProps = {
        pendingProjectId: myProjectState.myProject.id,
        registrationFormId: registrationFormId,
        items: items.map((item) => {
          if (item.type === "checkbox") {
            return {
              ...item,
              answer: Object.entries(item.answer).reduce((acc, [id, value]) => {
                if (value) acc.push(id)
                return acc
              }, [] as string[]),
            }
          }
          return item
        }),
      }

      try {
        await answerRegistrationForm({
          ...requestProps,
          idToken: await authState.firebaseUser.getIdToken(),
        })
        setProcessing(false)
        addToast({ title: "送信しました", kind: "success" })
        router.push(pagesPath.project.$url())
      } catch (err) {
        setProcessing(false)
        const reportError = () => {
          attachError({
            message: "failed to answer registration form",
            data: {
              registrationForm,
              body: requestProps,
            },
          })
          console.error(err)
        }

        switch (err.error?.info?.type) {
          case "ALREADY_ANSWERED_REGISTRATION_FORM": {
            addToast({
              title: "既に回答している登録申請です",
              kind: "error",
            })
            break
          }
          case "OUT_OF_PROJECT_CREATION_PERIOD": {
            addToast({ title: "企画応募期間外です", kind: "error" })
            break
          }
          default: {
            addToast({ title: "エラーが発生しました", kind: "error" })
            reportError()
            break
          }
        }
      }
    }
  }

  useEffect(() => {
    ;(async () => {
      setGeneralError(undefined)
      if (authState?.status !== "bothSignedIn") return
      if (!myProjectState?.myProject) {
        setGeneralError("noProject")
        return
      }
      if (!registrationFormId) {
        setGeneralError("noRegistrationFormId")
        return
      }

      const { registrationForm: fetchedRegistrationForm } =
        await getRegistrationForm({
          ...(myProjectState.isPending
            ? { pendingProjectId: myProjectState.myProject.id }
            : { projectId: myProjectState.myProject.id }),
          registrationFormId: registrationFormId,
          idToken: await authState.firebaseUser.getIdToken(),
        }).catch(async (err) => {
          addToast({ title: "エラーが発生しました", kind: "error" })
          const body = await err.response?.json()
          throw body ?? err
        })

      append(
        fetchedRegistrationForm.items
          .map((formItem) => {
            switch (formItem.type) {
              case "text": {
                return {
                  item_id: formItem.id,
                  type: "text" as const,
                  answer: "",
                }
              }
              case "checkbox": {
                return {
                  item_id: formItem.id,
                  type: "checkbox" as const,
                  answer: Object.fromEntries(
                    formItem.boxes.map(({ id }) => [id, false])
                  ),
                }
              }
              case "radio": {
                return {
                  item_id: formItem.id,
                  type: "radio" as const,
                  answer: null,
                }
              }
              case "integer": {
                return {
                  item_id: formItem.id,
                  type: "integer" as const,
                  answer: null,
                }
              }
            }
          })
          .filter(
            // FIXME:
            (nullable): nullable is any => Boolean(nullable)
          )
      )

      setRegistrationForm(fetchedRegistrationForm)
    })()
  }, [authState, myProjectState, registrationFormId])

  return (
    <div className={styles.wrapper}>
      <Head title="登録申請に回答" />
      <h1 className={styles.title}>登録申請に回答</h1>
      {registrationForm && generalError === undefined ? (
        <>
          <div className={styles.section}>
            <Panel>
              <h2 className={styles.formName}>{registrationForm.name}</h2>
              {registrationForm.description &&
                registrationForm.description.split("\n").map((text, index) => (
                  <p className={styles.formDescription} key={index}>
                    {text}
                  </p>
                ))}
            </Panel>
          </div>
          <div className={styles.section}>
            <Panel>
              <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                {registrationForm.items.map((formItem, index) => {
                  return (
                    <FormItemSpacer key={formItem.id}>
                      <>
                        {formItem.type === "text" && (
                          <TextFormItem
                            formItem={formItem}
                            register={register(
                              `items.${index}.answer` as const,
                              {
                                required: formItem.is_required,
                                maxLength: formItem.max_length,
                                minLength: formItem.min_length,
                              }
                            )}
                            errors={[
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.required && "必須項目です",
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.maxLength &&
                                `${formItem.max_length}字以内で入力してください`,
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.minLength &&
                                `${formItem.min_length}字以上で入力してください`,
                            ]}
                          />
                        )}
                        {formItem.type === "radio" && (
                          <RadioFormItem
                            formItem={formItem}
                            register={register(
                              `items.${index}.answer` as const,
                              {
                                required: formItem.is_required,
                              }
                            )}
                            errors={[
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.required && "必須項目です",
                            ]}
                          />
                        )}
                        {formItem.type === "integer" && (
                          <IntegerFormItem
                            formItem={formItem}
                            register={register(
                              `items.${index}.answer` as const,
                              {
                                required: formItem.is_required,
                                setValueAs: (value) =>
                                  value === "" ? null : Number(value),
                              }
                            )}
                            errors={[
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.required && "必須項目です",
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.min &&
                                `${formItem.min}以上で入力してください`,
                              (errors?.items?.[index]?.answer as any)?.types
                                ?.max &&
                                `${formItem.max}以下で入力してください`,
                            ]}
                          />
                        )}
                      </>
                    </FormItemSpacer>
                  )
                })}
                <div className={styles.submitButton}>
                  <Button
                    fullWidth
                    icon="paper-plane"
                    type="submit"
                    processing={processing}
                  >
                    回答を送信する
                  </Button>
                </div>
              </form>
            </Panel>
          </div>
        </>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            <>
              {(() => {
                if (generalError === "noProject")
                  return <p>メンバーとなっている企画がありません</p>

                if (generalError === "noRegistrationFormId")
                  return <p>お探しの登録申請は見つかりませんでした</p>

                return <Spinner />
              })()}
            </>
          </div>
        </Panel>
      )}
    </div>
  )
}
AnswerRegistrationForm.layout = "default"
AnswerRegistrationForm.rbpac = { type: "higherThanIncluding", role: "general" }

export default AnswerRegistrationForm
