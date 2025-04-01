import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, FastForward, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import getGenerativeData from "../backend/index.js";

const Index = () => {

  const [genData, setGenData] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const prompt = `Please analyze this transcript and create:
    1. Detailed bullet-point notes of the key points and concepts
    2. A clear, concise summary in simple language that anyone can understand
    3. present the notes in a way that is easy to read and understand use BOLD for the key points and concepts, maintain space between the bullet points and topics
    
    Format the response as follows:
    
    KEY NOTES:
    • [bullet points here]
    
    SUMMARY:
    [layman's terms summary here]

    return result in JSON using below JSON Structure Schema (stricly adhere):

    {
      "NOTES": [
        {
          "title": "string",
          "content": "string"
        }
      ],
      "SUMMARY": "string"
    }
    
    about
    ${videoUrl}`;

  const getContent = () => {
    getGenerativeData(apiKey, prompt)
      .then((res) => {
        setGenData(res);
        toast({
          title: "Success!",
          description: "Key Notes and Summary Generated Successfully!",
        });
      })
      .catch((error) => { // Catch any errors during the API call
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to generate notes. Please check your API key and video URL.",
          variant: "destructive",
        });
      });
  };


  const handleGenerate = () => {
    if (!videoUrl || !apiKey) {
      toast({
        title: "Missing Information",
        description: "Please provide both the video URL and API key.",
        variant: "destructive",
      });
      return;
    }

    getContent();
    setGenData(null);
    toast({
      title: "Please Wait!",
      description: "Generating Key Notes and Summary!",
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-secondary p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            YouTube Transcript & Notes Generator
          </h1>
          <p className="text-muted-foreground">
            Transform your YouTube videos into comprehensive notes and summaries
          </p>
        </div>

        <Card className="glass-morphism">
          <CardHeader>
            <CardTitle className="text-xl font-medium">
              Generate Your Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4" />
                <label className="text-sm font-medium">YouTube Video URL</label>
              </div>
              <Input
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                <label className="text-sm font-medium">Gemini API Key</label>
              </div>
              <Input
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-background/50"
              />
              <p className="text-xs text-muted-foreground">
                Provide API key to generate notes and summary
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Generate
              <FastForward className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {genData && (
          <Card className="glass-morphism animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-medium">
                  Notes and Summary
                </CardTitle>
                <Badge variant="secondary">Generated</Badge>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="mt-4">
              <ScrollArea className="h-[600px] w-full rounded-md">
                <div className="space-y-4 p-4">
                  <div className="space-y-2">
                    <Badge variant="outline">KEY NOTES</Badge>
                    {genData.NOTES && (
                      <ul>
                        {genData.NOTES.map((note, index) => (
                          <li key={index}>
                            <strong>{note.title}:</strong>
                            <br></br>
                            <li>
                              {note.content}
                            </li>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Badge variant="outline">SUMMARY</Badge>
                    <p className="text-sm leading-relaxed">
                      {genData.SUMMARY}
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;