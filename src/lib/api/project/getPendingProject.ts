import { client } from "../client"

import type { PendingProject } from "../../../types/models/project"

declare namespace getPendingProject {
  type Props = Readonly<{
    pendingProjectId: string
    idToken: string
  }>
}

const getPendingProject = async ({
  pendingProjectId,
  idToken,
}: getPendingProject.Props): Promise<{
  pendingProject: PendingProject | null
}> => {
  try {
    const { pending_project } = await client({ idToken })
      .get("pending-project/get", {
        searchParams: {
          pending_project_id: pendingProjectId,
        },
      })
      .json()
    return { pendingProject: pending_project }
  } catch (err) {
    const body = await err.response?.json()
    if (body.status === 404) {
      return { pendingProject: null }
    }
    throw body ?? err
  }
}

export { getPendingProject }
