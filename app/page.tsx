import TutorialPage from "@/components/tutorial-page";
import LabContolCard from "@/components/ui/LabContolCard";
import { NotionAPI } from "notion-client";
import { ExtendedRecordMap } from "notion-types";
export default async function Home() {
  const notion = new NotionAPI();
  const recordMap: ExtendedRecordMap = await notion.getPage(
    "abb30969370640d5b53524fb1d3ea34a"
  );

  return (
    <main className="min-h-screen items-center justify-between static">
      <div className="left overflow-hidden w-11/12">
        {recordMap ? <TutorialPage recordMap={recordMap} /> : null}
      </div>
      <LabContolCard />
    </main>
  );
}
