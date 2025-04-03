import React, { useState } from 'react';
import { TextField, Button, Typography, Box, List, ListItem } from '@mui/material';
import axios from 'axios';

const PasteColumns = () => {
  const [rawText, setRawText] = useState('');
  const [cleanedColumns, setCleanedColumns] = useState([]);
  const [matches, setMatches] = useState(null);

  const extractColumnNames = (input) => {
    const lines = input.split(/\r?\n/);
    const columns = [];
  
    for (let line of lines) {
      // Match the first word after a vertical pipe OR just the first word
      let match = line.match(/\|\s*([a-zA-Z0-9_]+)/) || line.match(/^\s*([a-zA-Z0-9_]+)/);
      if (match && match[1]) {
        columns.push(match[1].trim());
      }
    }
  
    // Remove duplicates and invalid entries
    const unique = [...new Set(columns.filter(Boolean))];
    return unique;
  };

const handleClean = () => {
  const columns = extractColumnNames(rawText);
  console.log("🧼 Cleaned Columns:", columns);  // Add this line for testing
  setCleanedColumns(columns);
  setMatches(null); // Reset matches
};

  const handleTestMatch = async () => {
    try {
        const response = await axios.post('https://xcellent.onrender.com/api/match-columns', {
            user_columns: cleanedColumns
      });
      setMatches(response.data.suggested_matches);
    } catch (error) {
      console.error('Match error:', error);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
      <Typography variant="h6">Paste SQL Columns</Typography>
      <TextField
        multiline
        rows={10}
        fullWidth
        label="Paste your column info here"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        sx={{ my: 2 }}
      />
      <Button variant="outlined" onClick={handleClean}>Clean & Preview</Button>

      {cleanedColumns.length > 0 && (
        <>
          <Typography sx={{ mt: 2 }}>🧹 Cleaned Columns:</Typography>
          <List dense>
            {cleanedColumns.map((col, index) => (
              <ListItem key={index}>{col}</ListItem>
            ))}
          </List>
          <Button variant="contained" onClick={handleTestMatch}>Test Match</Button>
        </>
      )}

      {matches && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">🧠 Suggested Matches</Typography>
          <List>
            {Object.entries(matches).map(([userCol, dbCol], i) => (
              <ListItem key={i}>
                <strong>{userCol}</strong> → {dbCol}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

export default PasteColumns;