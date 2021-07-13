import { useState, useEffect } from "react"

import { PageFC } from "next"
import Link from "next/link"

import { useAuthNeue } from "src/contexts/auth"
import { useToastDispatcher } from "src/contexts/toast"

import type { FileDistribution } from "src/types/models/files"
import { isUserRoleHigherThanIncluding } from "src/types/models/user/userRole"

import { listFileDistributions } from "src/lib/api/file/listFileDistributions"
import { reportError } from "src/lib/errorTracking/reportError"

import { pagesPath } from "src/utils/$path"

import { Button, Head, Panel, Spinner } from "src/components"

import styles from "./index.module.scss"

const CommitteeFileDistributionList: PageFC = () => {
  const { authState } = useAuthNeue()
  const { addToast } = useToastDispatcher()

  const [isEligibleToCreateNewFile, setIsEligibleToCreateNewFile] =
    useState(false)
  const [distributions, setDistributions] = useState<FileDistribution[]>()
  const [generalError, setGeneralError] = useState<"unknown">()

  useEffect(() => {
    ;(async () => {
      if (authState?.status != "bothSignedIn") return

      if (
        isUserRoleHigherThanIncluding({
          userRole: authState.sosUser.role,
          criteria: "committee_operator",
        })
      ) {
        setIsEligibleToCreateNewFile(true)
      }

      try {
        const fetchedDistributions = await listFileDistributions({
          idToken: await authState.firebaseUser.getIdToken(),
        })
        setDistributions(fetchedDistributions)
      } catch (err) {
        setGeneralError("unknown")
        addToast({ title: "エラーが発生しました", kind: "error" })
        reportError("failed to list file distributions for committee", err)
      }
    })()
  }, [authState])

  return (
    <div className={styles.wrapper}>
      <Head title="ファイル配布" />
      <h1 className={styles.title}>ファイル配布</h1>
      {isEligibleToCreateNewFile && (
        <div className={styles.actionsWrapper}>
          <Link href={pagesPath.committee.file.new.$url()}>
            <a>
              <Button icon="upload">ファイルを配布する</Button>
            </a>
          </Link>
        </div>
      )}
      {distributions && generalError === undefined ? (
        <>
          {distributions.length ? (
            <ul className={styles.list}>
              {distributions.map((distribution) => (
                <li key={distribution.id} className={styles.rowWrapper}>
                  <Link
                    href={pagesPath.committee.file.distribution.$url({
                      query: { distributionId: distribution.id },
                    })}
                  >
                    <a>
                      <Panel
                        style={{
                          padding: "24px 32px",
                        }}
                        hoverStyle="gray"
                      >
                        <div className={styles.rowInner}>
                          <p className={styles.distributionName}>
                            {distribution.name}
                          </p>
                        </div>
                      </Panel>
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Panel>
              <div className={styles.emptyWrapper}>
                <p>ファイル配布が存在しません</p>
              </div>
            </Panel>
          )}
        </>
      ) : (
        <Panel>
          <div className={styles.emptyWrapper}>
            {(() => {
              if (generalError === "unknown") {
                return <p>エラーが発生しました</p>
              }

              return <Spinner />
            })()}
          </div>
        </Panel>
      )}
    </div>
  )
}
CommitteeFileDistributionList.layout = "committee"
CommitteeFileDistributionList.rbpac = {
  type: "higherThanIncluding",
  role: "committee",
}

export default CommitteeFileDistributionList
