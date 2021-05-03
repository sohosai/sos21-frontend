import { PageFC } from "next"
import { useRouter } from "next/router"

import { pagesPath } from "../../utils/$path"

import { useAuthNeue } from "../../contexts/auth"
import { useMyProject } from "../../contexts/myProject"

import { Button, Head, Panel, Spinner } from "../../components"

import styles from "./new.module.scss"

const NewProject: PageFC = () => {
  const { authState } = useAuthNeue()
  const { myProjectState, createPendingProject } = useMyProject()

  const router = useRouter()

  const createSampleProject = async () => {
    if (authState === null || authState.firebaseUser == null) return

    const idToken = await authState.firebaseUser.getIdToken()

    await createPendingProject({
      props: {
        name: `サンプル企画${Math.floor(Math.random() * 500)}`,
        kana_name: "さんぷるきかく",
        group_name: `サンプルグループ${Math.floor(Math.random() * 500)}`,
        kana_group_name: "さんぷるぐるーぷ",
        description:
          "吾輩は猫である。名前はまだ無い。\nどこで生れたかとんと見当がつかぬ。",
        category: "general",
        attributes: ["academic", "artistic"],
      },
      idToken,
    })
      .then(({ pendingProject }) => {
        // TODO: リダイレクトなど
        router.push(
          pagesPath.accept_subowner.$url({
            query: { pendingProjectId: pendingProject.id },
          })
        )
      })
      .catch(async (err) => {
        const body = await err.response?.json()
        throw body ? body : err
      })
  }

  return (
    <div className={styles.wrapper}>
      <Head title="企画応募" />
      <h1 className={styles.title}>企画応募</h1>
      <div className={styles.panelWrapper}>
        <Panel>
          {!myProjectState?.error && myProjectState?.myProject === null ? (
            <>
              {/* TODO: */}
              <p className={styles.sampleProjectDescription}>
                現在企画応募機能は実装中のため、以下のボタンからサンプルの企画を作成することのみ可能です
              </p>
              <Button onClick={createSampleProject}>
                サンプルの企画を作成する
              </Button>
            </>
          ) : (
            <div className={styles.emptyWrapper}>
              {(() => {
                if (myProjectState === null) return <Spinner />

                if (myProjectState.error) return "エラーが発生しました"

                if (myProjectState.myProject)
                  return "既に企画の責任者または副責任者であるため、企画応募はできません"
              })()}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}
NewProject.layout = "default"
NewProject.rbpac = { type: "higherThanIncluding", role: "general" }

export default NewProject
