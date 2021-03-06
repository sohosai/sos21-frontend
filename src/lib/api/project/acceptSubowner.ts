import { client } from "../client"

import type { PendingProjectId, Project } from "../../../types/models/project"

declare namespace acceptSubowner {
  type Props = Readonly<{
    pendingProjectId: PendingProjectId
    idToken: string
  }>
}

const acceptSubowner = async ({
  pendingProjectId,
  idToken,
}: acceptSubowner.Props): Promise<
  | Project
  | {
      errorCode:
        | "pendingProjectNotFound"
        | "tooManyProjects"
        | "notAnsweredRegistrationForm"
        | "alreadyProjectOwner"
        | "alreadyProjectSubOwner"
        | "alreadyPendingProjectOwner"
        | "outOfProjectCreationPeriod"
    }
> => {
  try {
    const { project } = await client({ idToken })
      .post("project/create", {
        json: {
          pending_project_id: pendingProjectId,
        },
      })
      .json()
    return project
  } catch (err) {
    const body = await err.response?.json()

    switch (body.error?.info?.type) {
      case "PENDING_PROJECT_NOT_FOUND":
        return { errorCode: "pendingProjectNotFound" }
      case "TOO_MANY_PROJECTS":
        return { errorCode: "tooManyProjects" }
      case "NOT_ANSWERED_REGISTRATION_FORM":
        return { errorCode: "notAnsweredRegistrationForm" }
      case "ALREADY_PROJECT_OWNER":
        return { errorCode: "alreadyProjectOwner" }
      case "ALREADY_PROJECT_SUBOWNER":
        return { errorCode: "alreadyProjectSubOwner" }
      case "ALREADY_PENDING_PROJECT_OWNER":
        return { errorCode: "alreadyPendingProjectOwner" }
      case "OUT_OF_PROJECT_CREATION_PERIOD":
        return { errorCode: "outOfProjectCreationPeriod" }
    }

    throw body ?? err
  }
}

export { acceptSubowner }
