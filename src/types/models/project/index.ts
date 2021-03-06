import type { UserId, UserName, UserKanaName } from "../user"

export type PendingProject = Readonly<{
  id: PendingProjectId
  created_at: Date
  owner_id: UserId
  name: string
  kana_name: string
  group_name: string
  kana_group_name: string
  description: string
  category: ProjectCategory
  attributes: ProjectAttribute[]
}>

export type Project = Readonly<{
  id: ProjectId
  code: string
  created_at: Date
  owner_id: UserId
  owner_name: UserName
  owner_kana_name: UserKanaName
  subowner_id: UserId
  subowner_name: UserName
  subowner_kana_name: UserKanaName
  name: string
  kana_name: string
  group_name: string
  kana_group_name: string
  description: string
  category: ProjectCategory
  attributes: ProjectAttribute[]
}>

export type PendingProjectId = string

export type ProjectId = string

export type ProjectCategory = "general" | "stage" | "cooking" | "food"

export type ProjectAttribute = "academic" | "artistic" | "committee" | "outdoor"

export const projectCategoryToUiText = (
  projectCategory: ProjectCategory
): string => {
  const dict: {
    [category in ProjectCategory]: string
  } = {
    general: "一般企画",
    stage: "ステージ企画",
    cooking: "調理企画",
    food: "飲食物取扱企画",
  }
  return dict[projectCategory]
}

export const projectAttributeToUiText = ({
  projectAttribute,
  truncated = false,
}: {
  projectAttribute: ProjectAttribute
  truncated?: boolean
}): string => {
  const dict: {
    [attribute in ProjectAttribute]: string
  } = {
    academic: "学術参加枠",
    artistic: "芸術祭参加枠",
    outdoor: "屋外企画",
    committee: "委員会企画",
  }
  const truncatedDict: {
    [attribute in ProjectAttribute]: string
  } = {
    academic: "学",
    artistic: "芸",
    outdoor: "外",
    committee: "委",
  }

  return truncated ? truncatedDict[projectAttribute] : dict[projectAttribute]
}
