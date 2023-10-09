import DisplayInfo from "@/components/DisplayInfo";
import DisplayInfo_v2 from "@/components/DisplayInfo_v2";
import FileUpload from "@/components/FileUplaod";
import { Login } from "@/components/Login";
export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Login />
      <DisplayInfo_v2 />
      {/* <FileUpload /> */}
    </main>
  )
}
