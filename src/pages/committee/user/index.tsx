import { useState, useEffect } from "react"

import type { PageFC } from "next"

import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import { User, userCategoryTypeToUiText } from "../../../types/models/user"
import { userRoleToUiText } from "../../../types/models/user/userRole"

import { listUsers } from "../../../lib/api/user/listUsers"
import { exportUsers } from "../../../lib/api/user/exportUsers"

import { saveAs } from "file-saver"
import dayjs from "dayjs"

import { createCsvBlob } from "../../../utils/createCsvBlob"

import { Button, Head, Panel, Spinner } from "../../../components"

import styles from "./index.module.scss"

const ListUsers: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [users, setUsers] = useState<User[] | null>(null)
  const [downloading, setDownloading] = useState(false)

  const downloadUsersCsv = async () => {
    if (authState === null || authState.firebaseUser == null) return

    setDownloading(true)

    exportUsers({ idToken: await authState.firebaseUser.getIdToken() })
      .then((res) => {
        setDownloading(false)

        saveAs(
          createCsvBlob(res),
          `sos-users-${dayjs().format("YYYY-M-D-HH-mm")}.csv`
        )
      })
      .catch(async (err) => {
        setDownloading(false)
        const body = await err.response?.json()
        console.error(body ?? err)
      })
  }

  useEffect(() => {
    ;(async () => {
      if (authState === null || authState.firebaseUser == null) return

      const idToken = await authState.firebaseUser.getIdToken()

      if (idToken) {
        listUsers({ idToken })
          .then(({ users: fetchedUsers }) => {
            setUsers(fetchedUsers)
          })
          .catch(async (e) => {
            const body = await e.response?.json()
            addToast({ title: "エラーが発生しました", kind: "error" })
            throw body ?? e
          })
      }
    })()
  }, [authState])

  return (
    <div className={styles.wrapper}>
      <Head title="ユーザー一覧" />
      <h1 className={styles.title}>ユーザー一覧</h1>
      <div className={styles.downloadButton}>
        <Button
          icon="download"
          processing={downloading}
          onClick={downloadUsersCsv}
        >
          CSVでダウンロード
        </Button>
      </div>
      <Panel>
        {users?.length ? (
          <div className={styles.usersTableWrapper}>
            <table className={styles.table}>
              <thead className={styles.head}>
                <tr>
                  <th className={styles.headCell}>氏名</th>
                  <th className={styles.headCell}>権限</th>
                  <th className={styles.headCell}>所属</th>
                </tr>
              </thead>
              <tbody>
                {users.map(({ name, role, category, id }) => {
                  return (
                    <tr key={id} className={styles.row}>
                      <td
                        className={styles.cell}
                      >{`${name.last} ${name.first}`}</td>
                      <td className={styles.cell}>{userRoleToUiText(role)}</td>
                      <td className={styles.cell}>
                        {category.type === "undergraduate_student"
                          ? category.affiliation
                          : userCategoryTypeToUiText(category.type)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyWrapper}>
            {users === null ? (
              <>
                <Spinner />
              </>
            ) : (
              <p>ユーザーが存在しません</p>
            )}
          </div>
        )}
      </Panel>
    </div>
  )
}
ListUsers.layout = "committee"
ListUsers.rbpac = { type: "higherThanIncluding", role: "committee_operator" }

export default ListUsers
