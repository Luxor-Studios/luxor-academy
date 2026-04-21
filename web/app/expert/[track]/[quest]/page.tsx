import { QuestPage, generateQuestParamsFor } from "@/components/quest-page";

export function generateStaticParams() {
  return generateQuestParamsFor("expert");
}

export default async function Page({
  params,
}: {
  params: Promise<{ track: string; quest: string }>;
}) {
  const { track, quest } = await params;
  return <QuestPage tier="expert" track={track} quest={quest} />;
}
