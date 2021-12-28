import React, { useState } from 'react';
import { Grid, Box, Tab, Tabs as MuiTabs } from '@mui/material';
import { TabPanel } from './Panel';
import { Image } from '@common';


export interface Content {
  label: string;
  image: StaticImageData | StaticImageData[];
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
              {/* If only one image is sent */}
              { !Array.isArray(image) && (
                <Image src={image} alt="" sx={{ width: '100%', height: '100%' }} />
              )}

              {/* If an array of images is sent, generate a carousel */}
              { Array.isArray(image) && (
                <Image src={image[0] || ''} alt="" sx={{ width: '100%', height: '100%' }} />
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
