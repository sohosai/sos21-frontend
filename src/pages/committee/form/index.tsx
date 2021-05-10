import { useState, useEffect } from "react"

import type { PageFC } from "next"
import Link from "next/link"

import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import {
  Button,
  Head,
  IconButton,
  Panel,
  Spinner,
  Tooltip,
} from "src/components/"

import type { Form } from "../../../types/models/form"

import { listForms } from "../../../lib/api/form/listForms"
import { exportFormAnswers } from "../../../lib/api/formAnswer/exportFormAnswers"

import { pagesPath } from "../../../utils/$path"
import { createCsvBlob } from "../../../utils/createCsvBlob"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

import { saveAs } from "file-saver"

import styles from "./index.module.scss"

const ListForms: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [forms, setForms] = useState<Form[] | undefined | null>(null)

  useEffect(() => {
    ;(async () => {
      if (authState === null || authState.firebaseUser == null) return

      const idToken = await authState.firebaseUser.getIdToken()

      listForms({ idToken })
        .then(({ forms: fetchedForms }) => {
          setForms(fetchedForms)
        })
        .catch(async (err) => {
          const body = await err.response?.json()
          addToast({ title: "エラーが発生しました", kind: "error" })
          throw body ?? err
        })
    })()
  }, [authState])

  useEffect(() => {
    dayjs.extend(utc)
    dayjs.extend(timezone)
  }, [])

  return (
    <div className={styles.wrapper}>
      <Head title="申請一覧" />
      <h1 className={styles.title}>申請一覧</h1>
      <div className={styles.newFormButton}>
        <Link href={pagesPath.committee.form.new.$url()}>
          <a>
            <Button icon="plus">申請を新規作成</Button>
          </a>
        </Link>
      </div>
      {forms?.length ? (
        <>
          {forms.map((form) => (
            <div className={styles.formRowWrapper} key={form.id}>
              <Panel
                style={{
                  paddingTop: "24px",
                  paddingBottom: "24px",
                }}
              >
                <div className={styles.formRowInner}>
                  <p className={styles.formName}>{form.name}</p>
                  <p className={styles.formDate}>
                    {dayjs.tz(form.starts_at, "Asia/Tokyo").format("M/D HH:mm")}
                    <i
                      className={`jam-icons jam-arrow-right ${styles.formDateIcon}`}
                    />
                    {dayjs.tz(form.ends_at, "Asia/Tokyo").format("M/D HH:mm")}
                    <span className={styles.formDateState}>
                      {(() => {
                        if (
                          dayjs().isBefore(
                            dayjs.tz(form.starts_at, "Asia/Tokyo")
                          )
                        )
                          return "開始前"

                        if (
                          dayjs().isAfter(dayjs.tz(form.ends_at, "Asia/Tokyo"))
                        )
                          return "終了"

                        return "回答中"
                      })()}
                    </span>
                  </p>
                  <Tooltip title="回答をCSVでダウンロード">
                    <div>
                      <IconButton
                        icon="download"
                        onClick={async () => {
                          if (
                            authState === null ||
                            authState.firebaseUser === null
                          )
                            return

                          exportFormAnswers({
                            props: {
                              form_id: form.id,
                            },
                            idToken: await authState.firebaseUser.getIdToken(),
                          })
                            .then((res) => {
                              saveAs(
                                createCsvBlob(res),
                                `${form.name}-answers.csv`
                              )
                            })
                            .catch((err) => {
                              throw err
                            })
                        }}
                      />
                    </div>
                  </Tooltip>
                </div>
              </Panel>
            </div>
          ))}
        </>
      ) : (
        <div className={styles.panelWrapper}>
          <Panel>
            <div className={styles.emptyWrapper}>
              {forms === null ? (
                <>
                  <Spinner />
                </>
              ) : (
                <p>申請が作成されていません</p>
              )}
            </div>
          </Panel>
        </div>
      )}
    </div>
  )
}
ListForms.layout = "committee"
ListForms.rbpac = { type: "higherThanIncluding", role: "committee" }

export default ListForms
