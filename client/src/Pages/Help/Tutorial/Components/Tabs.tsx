import React, { useState } from 'react';
import { Grid, Box, Tab, CardMedia, Tabs as MuiTabs } from '@mui/material';
import { TabPanel } from './Panel';

export interface Content {
  label: string;
  image: string | string[];
  description: React.ReactElement;
}

interface TabsProps {
  tabContent: Content[];
}

export const Tabs = ({ tabContent }: TabsProps) => {
  const [currentTab, setCurrentTab] = useState(0);
  const handleTab = (_event: React.SyntheticEvent, newValue: number) => setCurrentTab(newValue);

  return (
    <React.Fragment>
      <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
        <MuiTabs value={currentTab} onChange={handleTab}>
          {tabContent.map(({ label }) => (
            <Tab key={label} label={label} />
          ))}
        </MuiTabs>
      </Box>

      {tabContent.map(({ label, description, image }, index) => (
        <TabPanel key={label} value={currentTab} index={index}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              {typeof image === 'string' && (
                <CardMedia component="img" image={image} alt="" />
              )}
              {Array.isArray(image) && (
                <CardMedia component="img" image={image[0] || ''} alt="" />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              {description}
            </Grid>
          </Grid>
        </TabPanel>
      ))}
    </React.Fragment>
  );
};
