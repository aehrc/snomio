import { Button, SxProps } from "@mui/material";
import useTaskById from "../../hooks/useTaskById";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import SchoolIcon from '@mui/icons-material/School';
import CallMergeIcon from '@mui/icons-material/CallMerge';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ArchiveIcon from '@mui/icons-material/Archive';
import axios from "axios";

import { io } from "socket.io-client";

const customSx: SxProps = {
    justifyContent: 'flex-start'
}
function TaskDetailsActions(){
    const task = useTaskById();

    const handleStartClassification = async () => {
        const socket = io("https://snomio.ihtsdotools.org:5173/authoring-services-websocket");
    }

    return (
        <div style={{marginTop: 'auto', display: 'flex', flexDirection:'column', gap: '.5em', padding: '1em'}}>
            <Button variant="contained" color="secondary" startIcon={<SettingsIcon/>} sx={customSx}>Edit Task Details</Button>
            <Button variant="contained" color="success" startIcon={<NotificationsIcon/>} sx={customSx} onClick={handleStartClassification}>Classify</Button>
            <Button variant="contained" startIcon={<SchoolIcon/>} sx={customSx}>Validate Without MRCM</Button>
            <Button variant="contained" startIcon={<QuestionAnswerIcon/>} sx={customSx}>Submit For Review</Button>
            <Button variant="contained" startIcon={<CallMergeIcon/>} sx={customSx}>Promote This Task to the Project</Button>
            <Button variant="contained" startIcon={<ArchiveIcon/>} sx={customSx}>Begin Promotion Automation</Button>
        </div>
        
    )
}

export default TaskDetailsActions;