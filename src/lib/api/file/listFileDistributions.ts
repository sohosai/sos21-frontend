import { client } from "../client"

import type { FileDistribution } from "src/types/models/files"

declare namespace listFileDistributions {
  type Props = Readonly<{
    idToken: string
  }>
}

const listFileDistributions = async ({
  idToken,
}: listFileDistributions.Props): Promise<FileDistribution[]> => {
  try {
    const { distributions } = await client({ idToken })
      .get("file-distribution/list")
      .json()
    return distributions
  } catch (err) {
    const body = await err.response?.json()
    throw body ?? err
  }
}

export { listFileDistributions }
