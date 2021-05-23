import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
dayjs.extend(utc)
dayjs.extend(timezone)

type Announcement = {
  id: string
  date: dayjs.Dayjs
  title: string
  text: string
}

export const announcements: Announcement[] = [
  {
    id: "a9294c64-e886-44b5-b305-d8cb548d60d7",
    date: dayjs.tz("2021-05-19T18:30:00", "Asia/Tokyo"),
    title: "オンラインステージ用募集要項公開",
    text: [
      "本日付けでオンラインステージ用募集要項を公開いたします。対面開催中止に伴う前回学園祭からの変更点等について記載されておりますので、企画応募をご検討の皆様は必ずご確認ください。",
      "今後も学園祭について情報発信を行ってまいりますので、ご確認のほどよろしくお願い申し上げます。",
    ].join("\n"),
  },
  {
    id: "df454852-f9af-40cd-b281-f1a3c11265e2",
    date: dayjs.tz("2021-05-20T18:30:00", "Asia/Tokyo"),
    title: "雙峰祭ガイダンス(オンラインステージ企画用)公開",
    text: [
      "オンラインステージ企画用雙峰祭ガイダンスを公開いたします。",
      "雙峰祭ガイダンスとは、前回学園祭からの変更点や特に重要な内容を簡潔にまとめた動画でございます。今年度は非常に多くの変更点がございますので、募集要項をご確認の際にぜひご一緒にご視聴ください。",
    ].join("\n"),
  },
  {
    id: "ebf708a8-0eb7-48db-b2d9-d33c0184c951",
    date: dayjs.tz("2021-05-23T18:30:00", "Asia/Tokyo"),
    title: "企画団体向けTwitterアカウント",
    text: [
      "企画団体向けTwitterアカウント@kikakurenrakunでは、企画応募を検討されている皆様に便利な情報を随時お届けしております。ぜひご確認ください。",
      "なお、ツイートはトップページのお知らせ欄からもご覧いただけます。",
    ].join("\n"),
  },
  {
    id: "eb840c93-ca79-48c1-b1f0-9c4b9569ce6c",
    date: dayjs.tz("2021-05-23T18:30:00", "Asia/Tokyo"),
    title: "オンラインステージの企画応募開始について",
    text: [
      "5月24日月曜日18:30より、オンラインステージの企画応募を開始いたします。",
      "締切は6月4日金曜日23:59です。",
      "感染症への対応など、前回からの変更点が多数ございますので、お申込みの際は募集要項を必ずご確認ください。",
      "締切を過ぎた申し込みは受付いたしかねますので、余裕を持ったご応募をお願いいたします。",
      "なお、一般企画については今回の企画応募の対象ではございません。6月下旬～7月下旬に募集要項配布を予定しておりますので、今後の情報にご注意ください。",
    ].join("\n"),
  },
]
