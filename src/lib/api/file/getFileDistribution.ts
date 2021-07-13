import { client } from "../client"

import type { FileDistribution } from "src/types/models/files"

declare namespace getFileDistribution {
  type Props = Readonly<{
    props: {
      distributionId: string
    }
    idToken: string
  }>

  type Error = {
    errorCode: "notFound"
    error?: any
  }
}

const getFileDistribution = async ({
  props: { distributionId },
  idToken,
}: getFileDistribution.Props): Promise<
  FileDistribution | getFileDistribution.Error
> => {
  try {
    const { distribution } = await client({ idToken })
      .get("file-distribution/get", {
        searchParams: {
          distribution_id: distributionId,
        },
      })
      .json()
    return distribution
  } catch (err) {
    const body = await err.response?.json()

    switch (body?.error?.info?.type) {
      case "FILE_DISTRIBUTION_NOT_FOUND":
        return { errorCode: "notFound", error: body }
    }

    throw body ?? err
  }
}

export { getFileDistribution }
