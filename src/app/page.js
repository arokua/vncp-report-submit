"use client";
import { useState } from "react";
import { Box, Button, Stack, Container, Tabs, Tab, Alert, Typography, CircularProgress } from "@mui/material";
import FileField from "@/components/fileField";

export default function Home() {
  const [files, setFiles] = useState({
    excel: null,
    es: null,
    ss: null,
    "webReports ES": null,
    "webReports DH": null,
    "webReports NUS": null,
    "webReports DEB": null,
    "students-now": null,
    "students-last-week": null,
  });
  const [tabValue, setTabValue] = useState(0);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fields = [
    { key: "excel", label: "So sánh tuần (Excel)", accept: { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"] }, multiple: false },
    { key: "es", label: "Khách ES (PDF)", accept: { "application/pdf": [".pdf"] }, multiple: false },
    { key: "ss", label: "Khách SS (PDF)", accept: { "application/pdf": [".pdf"] }, multiple: false },
    { key: "webReports ES", label: "Website reports Anh ngữ", accept: { "application/pdf": [".pdf"] }, multiple: false },
    { key: "webReports DH", label: "Website reports Du học", accept: { "application/pdf": [".pdf"] }, multiple: false },
    { key: "webReports NUS", label: "Website reports NUS", accept: { "application/pdf": [".pdf"] }, multiple: false },
    { key: "webReports DEB", label: "Website reports DEB", accept: { "application/pdf": [".pdf"] }, multiple: false },
    { key: "students-now", label: "Học viên tuần này", accept: { "application/pdf": [".pdf"] }, multiple: false },
    { key: "students-last-week", label: "Học viên tuần trước", accept: { "application/pdf": [".pdf"] }, multiple: false },
  ];

  const NEXT_PUBLIC_N8N_WEBHOOK = "https://destined-deeply-reptile.ngrok-free.app/webhook-test/generate-crm-report";

  function setFile(key) {
    return (val) => setFiles((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    const form = new FormData();
    if (files.excel) form.append("excel", files.excel);
    if (files.es) form.append("es", files.es);
    if (files.ss) form.append("ss", files.ss);
    if (files["students-now"]) form.append("students-now", files["students-now"]);
    if (files["students-last-week"]) form.append("students-last-week", files["students-last-week"]);
    if (files["webReports ES"]) form.append("web_0", files["webReports ES"]);
    if (files["webReports DH"]) form.append("web_1", files["webReports DH"]);
    if (files["webReports NUS"]) form.append("web_2", files["webReports NUS"]);
    if (files["webReports DEB"]) form.append("web_3", files["webReports DEB"]);
    // form.append("returnUrl", `${window.location.origin}/api/callback`);

    try {
      const res = await fetch(NEXT_PUBLIC_N8N_WEBHOOK, {
        method: "POST",
        body: form,
      });

      if (res.status === 200) {
        const contentType = res.headers.get("content-type");
        if (contentType.includes("text/plain")) {
          // for n8n plain text responses
          const text = await res.text();
          setResponse({ status: 200, text });
        }
        else if (contentType.includes("application/json")) {
          const data = await res.json();
          setResponse({ status: 200, data });
        } else if (contentType.includes("application/vnd.openxmlformats")) {
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          setResponse({ status: 200, data: { fileUrl: url, fileName: "report.docx" } });
        }
        setTabValue(1);
      } else {
        setError(`Upload failed with status ${res.status}. Please try again or check the server.`);
      }
    } catch (err) {
      setError("Failed to connect to the server. Check your network or webhook URL.");
    } finally {
      setLoading(false);
    }
  }

  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} aria-label="upload and response tabs">
          <Tab label="Upload Files" id="tab-0" aria-controls="tabpanel-0" />
          <Tab label="Response" id="tab-1" aria-controls="tabpanel-1" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {fields.map((f) => (
                <FileField
                  key={f.key}
                  label={f.label}
                  accept={f.accept}
                  multiple={f.multiple}
                  value={files[f.key]}
                  onChange={setFile(f.key)}
                />
              ))}
              <Button type="submit" variant="contained" size="large" disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Upload all"}
              </Button>
            </Stack>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {response && response.status === 200 && (
            <Stack spacing={2}>
              <Alert severity="success">Upload successful! Workflow triggered.</Alert>
              {response.data?.fileUrl && (
                <Button
                  variant="contained"
                  href={response.data.fileUrl}
                  download={response.data.fileName}
                  sx={{ mt: 2 }}
                >
                  Download Report
                </Button>
              )}
              {loading && <CircularProgress />}
              {response.text && (
                <Box
                  sx={{
                    whiteSpace: "pre-wrap",
                    background: "#f5f5f5",
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  <Typography component="div">{response.text}</Typography>
                </Box>
              )}
              {response.data && !response.data.fileUrl && (
                // <Box>
                //   <Typography variant="h6">Response Data:</Typography>
                //   <pre style={{ background: "#f5f5f5", padding: 16, borderRadius: 4, overflowX: "auto" }}>
                //     {JSON.stringify(response.data, null, 2)}
                //   </pre>
                // </Box>
                
                 <Button
                  variant="contained"
                  href={response.data.fileUrl}
                  download={response.data.fileName}
                  sx={{ mt: 2 }}
                  onClick={() => {
                    const blob = new Blob([response.text], { type: 'text/plain' });
                    const url  = URL.createObjectURL(blob);
                    const a    = document.createElement('a');
                    a.href     = url;
                    a.download = `report-week-${week}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Tải xuống báo cáo bằng TXT
                </Button>
              )}
            </Stack>
          )}
          {!response && !error && (
            <Typography>Không có dữ liệu hiển thị.</Typography>
          )}
        </TabPanel>
      </Box>
    </Container>
  );
}
