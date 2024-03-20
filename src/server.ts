import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import {
    getApprovedEvents,
    getUnapprovedEvents,
    getSpecificEvent,
    searchEventApproved,
    searchEventUnapproved
} from "./loadData";
import {
    addEvent,
    approveEvent,
    addHighlight, editEvent
} from "./storeData";
import {deleteEvent} from "./deleteEvent";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res : Response)  => {
    res.send('Express + Typescript ');
});

app.listen(port, ()=>{
    console.log(`[server]: Server is running at http://localhost:${port} Server My Server is running on port ${port}!`);
});

app.get('/v1/events/approved', async (req: Request, res: Response) => {
    try {
        const response = await getApprovedEvents();
        // Statuscode 200, wenn Daten vorhanden sind
        // Statuscode 204, wenn keine Daten vorhanden sind
        const statusCode = response.length > 0 ? 200 : 204;
        res.status(statusCode).json(response);

    } catch(error){
        // Statuscode 500, wenn ein Fehler aufgetreten ist
        res.status(500).json({ error: 'Internal Server Error' });
        console.error('Fehler beim Laden und Verarbeiten der Daten:', error);
    }
});
app.get('/v1/events/unapproved', async (req: Request, res: Response) => {
    try {
        const response = await getUnapprovedEvents();
        console.log(response.length);
        // Statuscode 200, wenn Daten vorhanden sind
        // Statuscode 204, wenn keine Daten vorhanden sind
        let statusCode = response.length > 0 ? 200 : 204;
        res.status(statusCode).json(response);

    } catch(error){
        // Statuscode 500, wenn ein Fehler aufgetreten ist
        res.status(500).json({ error: 'Internal Server Error' });
        console.error('Fehler beim Laden und Verarbeiten der Daten:', error);
    }
});
app.get('/v1/events/loadEvent', async (req: Request, res: Response) => {
    try {
        const response = await getSpecificEvent(req.query.id as string);
        let statusCode : number;
        if (response === 'Event not found') {
            // Statuscode 204, wenn keine Daten vorhanden sind 404 könnte auch passen TODO: mit Inken absprechen
            //
            statusCode = 204;
        }else {
            // Statuscode 200, wenn Daten vorhanden sind
            statusCode = 200;
        }
        res.status(statusCode).json(response);

    } catch(error){
        // Statuscode 500, wenn ein Fehler aufgetreten ist
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/v1/events/addNewEvent', async (req: Request, res: Response) => {
    try{
    const response = await addEvent(req.body);
    let statusCode : number;
    if (response === 'Object dose not match the required structure. Please check the documentation.') {
        statusCode = 400;
    }else{
        statusCode = 200;
    }
    res.status(statusCode).json(response);
    }catch (error){
        // Statuscode 500, wenn ein Fehler aufgetreten ist
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/v1/events/searchEvent', async (req: Request, res: Response) => {
    try {
        if (req.query.searchKey === undefined) {
            res.status(400).json({ error: 'No search key provided' });
            return;
        }
        let response;
        if (req.query.approved === 'true') {
            response = await searchEventApproved(req.query.searchKey as string);
        } else if (req.query.approved === 'false') {
            response = await searchEventUnapproved(req.query.searchKey as string);
        } else {
            res.status(400).json({ error: 'No approved status provided' });
            return;
        }
        let statusCode : number;
        if (response === 'No event found') {
            statusCode = 204;
        }else {
            statusCode = 200;
        }
        res.status(statusCode).json(response);

    } catch(error){
        // Statuscode 500, wenn ein Fehler aufgetreten ist
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.delete('/v1/events/deleteEvent', async (req: Request, res: Response) => {
    try {
        if (req.query.id === undefined) {
            res.status(400).json({ error: 'No id provided' });
            return;
        }
        const response = await deleteEvent(req.query.id as string);
        let statusCode : number;
        if (response === 'No event found') {
            statusCode = 204;
        } else {
            statusCode = 200;
        }
        console.log(response);
        res.status(statusCode).json(response);
    }catch (error){
        // Statuscode 500, wenn ein Fehler aufgetreten ist
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.patch('/v1/events/approveEvent', async (req: Request, res: Response) => {
try {
        if (req.query.id === undefined) {
            res.status(400).json({ error: 'No id provided' });
            return;
        }
        const response = await approveEvent(req.query.id as string);
        let statusCode : number;
        if (response === 'Event not found') {
            statusCode = 204;
        } else {
            statusCode = 200;
        }
        res.status(statusCode).json(response);
    }catch (error){
        // Statuscode 500, wenn ein Fehler aufgetreten ist
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.put('/v1/events/editEvent', async (req: Request, res: Response) => {
    try {
        if (req.body === undefined) {
            res.status(400).json({ error: 'No Data provided' });
            return;
        }
        const response = await editEvent(req.body);
        let statusCode : number;
        if (response === 'No changes made to the event. Please check the documentation.'){
            statusCode = 400;
        } else if (response === 'Event not found') {
            console.log(response);
            statusCode = 204;
        }else {
            statusCode = 200;
        }
            res.status(statusCode).json(response);
    }catch(error){
        // Statuscode 500, wenn ein Fehler aufgetreten ist
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/v1/events/addHighlight', async (req: Request, res: Response) => {
    try {
        if (req.body === undefined) {
            res.status(400).json({ error: 'No Data provided' });
            return;
        }
        const response = await addHighlight(req.body);
        let statusCode : number;
        if (response === 'Event not found') {
            statusCode = 204;
        } else {
            statusCode = 200;
        }
        res.status(statusCode).json(response);
    }catch{
        // Statuscode 500, wenn ein Fehler aufgetreten ist
        res.status(500).json({ error: 'Internal Server Error' });
    }
});