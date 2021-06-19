import { client } from "../client"

declare namespace getSharedFile {
  type Props = Readonly<{
    props: {
      sharingId: string
    }
    idToken: string
  }>
}

const getSharedFile = async ({
  props: { sharingId },
  idToken,
}: getSharedFile.Props): Promise<
  | { blob: Blob; filename?: string }
  | {
      errorCode: "fileNotFound" | "insufficientPermission" | "nonSharableFile"
      error?: any
    }
> => {
  try {
    const res = await client({ idToken }).get("file-sharing/get-file", {
      searchParams: {
        sharing_id: sharingId,
      },
    })

    const contentDisposition = res.headers
      .get("content-disposition")
      ?.split(";")
      ?.map((str) => str.trim())
    const filenameStar = contentDisposition
      ?.find((str) => str.startsWith("filename*"))
      // 今のところこれでOK
      ?.replace("filename*=UTF-8''", "")
    const filename = filenameStar ? decodeURIComponent(filenameStar) : undefined

    return { blob: (await res.blob()) as Blob, filename }
  } catch (err) {
    const body = await err.response?.json()

    switch (body?.error?.info?.type) {
      case "FILE_SHARING_NOT_FOUND":
        return { errorCode: "fileNotFound", error: body }
      case "INSUFFICIENT_PERMISSIONS":
        return { errorCode: "insufficientPermission", error: body }
      case "NON_SHARABLE_FILE":
        return { errorCode: "nonSharableFile", error: body }
    }

    throw body ?? err
  }
}

export { getSharedFile }
