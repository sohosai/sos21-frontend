import { useState, useEffect } from "react"

import { PageFC } from "next"
import { useRouter } from "next/router"

import { listMyProjects } from "../../lib/api/project/listMyProjects"
// import { listMyPendingProjects } from "../../lib/api/project/listMyPendingProjects"
import { createPendingProject } from "../../lib/api/project/createPendingProject"

import { pagesPath } from "../../utils/$path"

import { useAuth } from "../../contexts/auth"

import { Button, Panel, Spinner } from "../../components"

import styles from "./new.module.scss"

const NewProject: PageFC = () => {
  const { idToken, sosUser } = useAuth()

  const router = useRouter()

  const [hasMyProject, setHasMyProject] = useState<boolean | null>(null)

  // TODO: バックで subowner 関連リリース次第やる
  // const [hasMyPendingProject, setHasMyPendingProject] = useState<
  //   boolean | null
  // >(null)

  useEffect(() => {
    if (!idToken || !sosUser) return

    listMyProjects({ idToken })
      .then(({ projects: fetchedProjects }) => {
        if (
          fetchedProjects.length === 0 ||
          !fetchedProjects.some((project) => {
            return project.owner_id === sosUser.id
            // TODO:
            // return project.owner_id === sosUser.id || project.subowner_id === sosUser.id
          })
        ) {
          setHasMyProject(false)
        } else {
          setHasMyProject(true)
        }
      })
      .catch(async (err) => {
        const body = await err.response?.json()
        throw body ? body : err
      })

    // TODO: バックで subowner 関連リリース次第やる
    // listMyPendingProjects({ idToken })
  })

  const createSampleProject = async () => {
    if (!idToken || !sosUser) return

    await createPendingProject({
      props: {
        name: `サンプル企画${Math.floor(Math.random() * 500)}`,
        kana_name: "さんぷるきかく",
        group_name: `サンプルグループ${Math.floor(Math.random() * 500)}`,
        kana_group_name: "さんぷるぐるーぷ",
        description:
          "吾輩は猫である。名前はまだ無い。\nどこで生れたかとんと見当がつかぬ。何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。",
        category: "general",
        attributes: ["academic", "artistic"],
      },
      idToken,
    })
      .then((res) => {
        console.log(res)

        // TODO: リダイレクトなど
        router.push(pagesPath.mypage.$url())
      })
      .catch(async (err) => {
        const body = await err.response?.json()
        throw body ? body : err
      })
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>企画応募</h1>
      <div className={styles.panelWrapper}>
        <Panel>
          {
            // TODO:
            // hasMyProject === false && hasMyPendingProject === false
            hasMyProject === false ? (
              <>
                {/* TODO: */}
                <p className={styles.sampleProjectDescription}>
                  現在企画応募機能は実装中のため、以下のボタンからサンプルの企画を作成することのみ可能です
                </p>
                <Button
                  buttonRestAttributes={{
                    onClick: createSampleProject,
                  }}
                >
                  サンプルの企画を作成する
                </Button>
              </>
            ) : (
              <div className={styles.emptyWrapper}>
                {(() => {
                  if (hasMyProject)
                    return "既に企画の責任者または副責任者であるため、企画応募はできません"
                  return <Spinner />
                })()}
              </div>
            )
          }
        </Panel>
      </div>
    </div>
  )
}
NewProject.layout = "default"
NewProject.rbpac = { type: "higherThanIncluding", role: "general" }

export default NewProject
