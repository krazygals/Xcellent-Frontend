import React, { useState } from 'react';
import { TextField, Button, Typography, Box, List, ListItem } from '@mui/material';
import axios from 'axios';

const PasteColumns = () => {
  const [rawText, setRawText] = useState('');
  const [cleanedColumns, setCleanedColumns] = useState([]);
  const [matches, setMatches] = useState(null);

  const extractColumnNames = (input) => {
    const lines = input
      .split(/\n|,/)
      .map(line => line.trim().split(/\s+/)[0]) // Get first "word" on each line
      .filter(word => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(word)); // Filter valid SQL names
    return [...new Set(lines)];
  };

  const handleClean = () => {
    const columns = extractColumnNames(rawText);
    setCleanedColumns(columns);
    setMatches(null); // Reset matches
  };

  const handleTestMatch = async () => {
    try {
      const response = await axios.post('/api/match-columns', {
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