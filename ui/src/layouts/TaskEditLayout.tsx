import { ReactNode, useEffect, useState } from "react";
import { Box, Drawer, Tab, Tabs } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import EmailIcon from '@mui/icons-material/Email';
import ListIcon from '@mui/icons-material/List';
import { useParams } from "react-router-dom";
import useTaskStore from "../stores/TaskStore";
import TaskDetails from "../components/tasks/TaskDetails";
import useTaskById from "../hooks/useTaskById";


interface TabPanelProps {
    children?: ReactNode;
    value: number;
    index: number;
}

interface TabPanelItem {
    component: ReactNode;
}
const tabPanelItems: TabPanelItem[] = [
    {
        component: <div>0</div>
    },
    {
        component: <div>1</div>
    },
    {
        component: <div>2</div>
    },
    {
        component: <TaskDetails/>
    }
]

function TabPanel(props: TabPanelProps){
    const {value, index} = props;

    return (
        <>
        {value === index ? <>{tabPanelItems[value].component}</> : <></>}
        </>
        
    )
}

function TaskEditLayout(){
    const [open, setOpen] = useState(true);
    const [openTab, setOpenTab] = useState(3);
    
    const task = useTaskById();

    const handleTabChange = ( event: React.SyntheticEvent, newValue: number) => {
        event.preventDefault();
        setOpenTab( newValue );
    };

    const handleOpenChange = () => {
        setOpen(!open);
    }

    return (
        <div style={{position: 'relative', height: 'calc(100% - 64px)'}}>
            <Drawer
                anchor="left"
                open={open}
                variant="permanent"
                // to make the drawer relative to the div, not the page
                sx={{
                    '& .MuiDrawer-root': {
                        position: 'absolute'
                    },
                    '& .MuiPaper-root': {
                        position: 'absolute'
                    }
                }}
            >
                <Box 
                    sx={{
                        borderBottom: 1, borderColor: 'divider'
                    }}
                >
                    <Tabs value={openTab} onChange={handleTabChange}>
                        <Tab label="Search" icon={<SearchIcon/>}/>
                        <Tab label="List" icon={<ListIcon/>}/>
                        <Tab label="Reviews" icon={<EmailIcon/>}/>
                        <Tab label="Info" icon={<InfoIcon/>}/>
                    </Tabs>
                </Box>
                <TabPanel index={0} value={openTab}
                />
                <TabPanel index={1} value={openTab}/>
                <TabPanel index={2} value={openTab}/>
                <TabPanel index={3} value={openTab}/>
            </Drawer>
            
        </div>
            
        
    )
}

export default TaskEditLayout;