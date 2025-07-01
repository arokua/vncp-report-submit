"use client";
import { useContext, useState } from "react";
import { UserCtx } from "../providers";
import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// For more styling
import FileFieldMUI from "@/components/fileField";
import { Box, Button, Stack, Container } from "@mui/material";
import Dropzone from "react-dropzone";

const schema = z.object({
  excel: z.instanceof(File, { message: "Excel file is required" }),
  pdfs: z
    .array(z.instanceof(File))
    .min(1, "Upload at least one PDF")
    .max(8, "Max 8 PDFs"),
});

export default function Home() {
  const user = useContext(UserCtx);
  const [sending, setSending] = useState(false);

  async function onSubmit(data) {
    setSending(true);
    const form = new FormData();
    form.append("excel", data.excel);
    data.pdfs.forEach((f, i) => form.append(`pdf_${i}`, f));

    const res = await fetch("/api/upload", { method: "POST", body: form });
    setSending(false);
    if (!res.ok) alert("Upload failed");
  }

  // if (!user?.uid) {
  //   return (
  //     <main className="h-screen flex items-center justify-center">
  //       <button
  //         className="px-6 py-3 rounded-lg bg-black text-white"
  //         onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
  //       >
  //         Sign in with Google
  //       </button>
  //     </main>
  //   );
  // }
  const [files, setFiles] = useState({
    excel: null,
    es: null,
    ss: null,
    webReports: [],
  });

  const fields = [
    {
      key: "excel",
      label: "So sánh tuần (Excel)",
      accept: {
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
      },
      multiple: false,
    }
    // ,{
    //   key: "es",
    //   label: "Khách ES (PDF)",
    //   accept: { "application/pdf": [".pdf"] },
    //   multiple: false,
    // },
    // {
    //   key: "ss",
    //   label: "Khách SS (PDF)",
    //   accept: { "application/pdf": [".pdf"] },
    //   multiple: false,
    // },
    // {
    //   key: "webReports",
    //   label: "Website reports (4× PDF)",
    //   accept: { "application/pdf": [".pdf"] },
    //   multiple: true,
    // },
  ];

  function set(key) {
    return (val) => setFiles((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData();
    form.append("excel", files.excel);
    ["es", "ss"].forEach((k) => form.append(k, files[k]));
    files.webReports.forEach((f, i) => form.append(`web_${i}`, f));
    await fetch("/api/upload", { method: "POST", body: form });
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {fields.map((f) => (
            <FileFieldMUI
              key={f.key}
              label={f.label}
              accept={f.accept}
              multiple={f.multiple}
              value={files[f.key]}
              onChange={set(f.key)}
            />
          ))}
          <Button type="submit" variant="contained" size="large">
            Upload all
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
