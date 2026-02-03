import {
  Box,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Grid,
  Paper
} from "@mui/material";
import { useState } from "react";
import axios from "axios";

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [purpose, setPurpose] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/email/generate",
        { emailContent, tone, targetAudience, purpose }
      );
      setGeneratedReply(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(120deg, #0f2027, #203a43, #2c5364)",
        backgroundSize: "300% 300%",
        animation: "gradientFlow 12s ease infinite",
        py: 6
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontFamily: "Georgia, serif",
            color: "#fff",
            mb: 5
          }}
        >
          AI Email Reply Generator
        </Typography>

        {/* Main Layout */}
        <Grid container spacing={4} alignItems="flex-start">

          {/* LEFT SIDE – INPUT */}
          <Grid item xs={2} md={6}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "rgba(255,255,255,0.95)"
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Original Email Content"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Tone (Optional)</InputLabel>
                <Select
                  value={tone}
                  label="Tone (Optional)"
                  onChange={(e) => setTone(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Target Audience (Optional)</InputLabel>
                <Select
                  value={targetAudience}
                  label="Target Audience (Optional)"
                  onChange={(e) => setTargetAudience(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="hr">HR</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="client">Client</MenuItem>
                  <MenuItem value="customer">Customer</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Purpose (Optional)</InputLabel>
                <Select
                  value={purpose}
                  label="Purpose (Optional)"
                  onChange={(e) => setPurpose(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="job_application">
                    Job Application
                  </MenuItem>
                  <MenuItem value="follow_up">Follow Up</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                </Select>
              </FormControl>

              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={!emailContent || loading}
                sx={{
                  py: 1.2,
                  fontWeight: "bold"
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  "Generate Reply"
                )}
              </Button>
            </Paper>
          </Grid>

          {/* RIGHT SIDE – OUTPUT */}
          <Grid item xs={4} lg={4}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "rgba(255,255,255,0.95)"
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={10}
                label="AI Generated Email"
                value={generatedReply}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />

              <Button
                fullWidth
                variant="outlined"
                onClick={() =>
                  navigator.clipboard.writeText(generatedReply)
                }
                disabled={!generatedReply}
              >
                Copy to Clipboard
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Gradient Animation */}
      <style>
        {`
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </Box>
  );
}

export default App;
