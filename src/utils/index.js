function parseTextToJSON(text) {
    // Remove the "json" prefix and backticks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('json ')) {
      cleanedText = cleanedText.substring(5);
    }
    if (cleanedText.startsWith('```') && cleanedText.endsWith('```')) {
      cleanedText = cleanedText.substring(3, cleanedText.length - 3);
    }
    
    try {
      // Parse the JSON
      const parsedData = JSON.parse(cleanedText);
      
      // Clean up and format the data
      // Process content for each note to handle Markdown formatting
      if (parsedData.NOTES) {
        parsedData.NOTES = parsedData.NOTES.map(note => {
          // Convert bullet points to a more structured format if needed
          let contentLines = note.content.split('\n\n');
          
          // Process each content line
          contentLines = contentLines.map(line => {
            // Strip Markdown formatting if needed
            return line.replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
                       .replace(/\*(.*?)\*/g, '$1');    // Remove italics
          });
          
          return {
            ...note,
            content: contentLines.join('\n\n')
          };
        });
      }
      
      return parsedData;
    } catch (error) {
      console.log("Error parsing JSON:", error);
      return null;
    }
  }

  export default parseTextToJSON;