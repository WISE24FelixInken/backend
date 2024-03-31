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
import {
    deleteEvent,
    deleteHighlight
} from "./deleteData";
import cors from "cors";
import {startUp} from "./SimulateDB/EventData";


/**
 * Laden der env Variablen hier nur der Port
 */
dotenv.config();

/**
 * Express Server Starten
 * Port wird aus der env Variable PORT oder 3001 genommen
 * für den Fall das keine env Variable gesetzt ist
 *
 * Der Server wird zum Verwenden von JSON und CORS konfiguriert
 *
 */

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());


/**
 * Server wird gestartet und gibt eine Meldung aus, auf welchem Port er läuft
 */
app.listen(port, ()=>{
    console.log(`[server]: Server is running at http://localhost:${port} Server My Server is running on port ${port}!`);
});

/**
 * Der Server hat folgende Endpunkte:
 *
 *  GET     /v1/events/approved
 *  GET     /v1/events/unapproved
 *  GET     /v1/events/loadEvent
 *  GET     /v1/events/searchEvent
 *  POST    /v1/events/addNewEvent
 *  DELETE  /v1/events/deleteEvent
 *  PATCH   /v1/events/approveEvent
 *  PUT     /v1/events/editEvent
 *  POST    /v1/events/addHighlight
 *  DELETE  /v1/events/deleteHighlight
 *  POST    /v1/startup
 *
 */
/**
 *  GET     /v1/events/approved:
 *  Gibt alle Events zurück, die bereits genehmigt wurden und sortiert sie nach dem Erstellungsdatum absteigend.
 *  Der Request body benötigt keine Parameter
 *  @param {Request} req
 *  @param {Response} res
 *  @returns {Response} response
 *
 */
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

/**
 *  GET     /v1/events/unapproved:
 *  Gibt alle Events zurück, die noch nicht genehmigt wurden und sortiert sie nach dem Erstellungsdatum absteigend.
 *  Der Request body benötigt keine Parameter
 *  @param {Request} req
 *  @param {Response} res
 *  @returns {Response} response
 *
 */
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

/**
 *  GET     /v1/events/loadEvent:
 *  Gibt ein spezifisches Event zurück, das anhand der Event-ID identifiziert wird.
 *  Der Request-Body muss die Event-ID enthalten.
 *  @param {Request} req
 *  @param {Request.query.id} req.query.id
 *  @param {Response} res
 *  @returns {Response} response
 *
 */
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
/**
 *  POST     /v1/events/addNewEvent:
 *  Fügt ein neues Event hinzu. Der Request-Body muss die erforderlichen Daten enthalten.
 *  @param {Request} req
 *  @param {Request.body} req.body
 *  @param {Response} res
 *  @returns {Response} response
 *
 */
app.post('/v1/events/addNewEvent', async (req: Request, res: Response) => {
    try{
    const response = await addEvent(req.body);
    let statusCode : number;
    if (response === 'Object dose not match the required structure. Please check the documentation.') {
        statusCode = 400;
    }else{
        statusCode = 201;
    }
    res.status(statusCode).json(response);
    }catch (error){
        // Statuscode 500, wenn ein Fehler aufgetreten ist
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
/**
 *  GET     /v1/events/searchEvent:
 *  Sucht nach einem Event anhand eines Suchschlüssels. Der Suchschlüssel kann in den Eigenschaften des Events enthalten sein.
 *  Der Request-Body muss den Suchschlüssel und den Genehmigungsstatus enthalten.
 *  @param {Request} req
 *  @param {Request.query.searchKey} req.query.searchKey
 *  @param {Request.query.approved} req.query.approved
 *  @param {Response} res
 *  @returns {Response} response
 *
 */
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
/**
 * DELETE     /v1/events/deleteEvent:
 * Löscht ein Event anhand der Event-ID.
 * Der Request-Body muss die Event-ID enthalten.
 * @param {Request} req
 * @param {Request.query.id} req.query
 * @param {Response} res
 * @returns {Response} response
 *
 */
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
/**
 * PATCH     /v1/events/approveEvent:
 * Genehmigt ein Event anhand der Event-ID.
 * Der Request-Body muss die Event-ID enthalten.
 * @param {Request} req
 * @param {Request.query.id} req.query
 * @param {Response} res
 * @returns {Response} response
 *
 */
app.patch('/v1/events/approveEvent', async (req: Request, res: Response) => {
try {
        if (req.query.id === undefined) {
            res.status(400).json({ error: 'No id provided' });
            return;
        }
        const response = await approveEvent(req.query.id as string);
        let statusCode : number;
        if (response === 'Event not found') {
            statusCode = 404;
        } else if(response === 'Event already approved'){
            statusCode = 409;
        }else {
            statusCode = 200;
        }
        res.status(statusCode).json(response);
    }catch (error){
        // Statuscode 500, wenn ein Fehler aufgetreten ist
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
/**
 * PUT     /v1/events/editEvent:
 * Bearbeitet ein Event anhand der Event-ID.
 * Der Request-Body muss die Event-ID und die zu bearbeitenden Daten enthalten aber ausdrücklich nicht alle Daten eines Events.
 * @param {Request} req
 * @param {Request.body} req.body
 * @param {Response} res
 * @returns {Response} response
 *
 */
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
/**
 * POST     /v1/events/addHighlight:
 * Fügt ein Highlight zu einem Event hinzu.
 * Der Request-Body muss die Event-ID und die Highlight-Daten enthalten.
 * @param {Request} req
 * @param {Request.body} req.body
 * @param {Response} res
 * @returns {Response} response
 *
 */
app.post('/v1/events/addHighlight', async (req: Request, res: Response) => {
    try {
        if (req.body === undefined) {
            res.status(400).json({ error: 'No Data provided' });
            return;
        }
        const response = await addHighlight(req.body);
        let statusCode : number;
        if (response === 'Event not found') {
            statusCode = 404;
        } else {
            statusCode = 201;
        }
        res.status(statusCode).json(response);
    }catch{
        // Statuscode 500, wenn ein Fehler aufgetreten ist
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
/**
 * DELETE     /v1/events/deleteHighlight:
 * Löscht ein Highlight aus einem Event anhand der Event-ID und der Highlight-ID.
 * Der Request-Body muss die Event-ID und die Highlight-ID enthalten.
 * @param {Request} req
 * @param {Request.query.id} req.query.id
 * @param {Request.query.highlightId} req.query.highlightId
 * @param {Response} res
 * @returns {Response} response
 *
 */
app.delete('/v1/events/deleteHighlight', async (req: Request, res: Response) => {
    console.log('deleteHighlight');
    try {
        if (req.query.id === undefined) {
            res.status(400).json({ error: 'No id provided' });
            return;
        }
        const response = await deleteHighlight(req.query.id as string, req.query.highlightId as string);
        let statusCode : number;
        if (response === 'No event found' || response === 'No highlight found') {
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
/**
 * POST     /v1/startup:
 * Füllt den Server mit Beispieldaten.
 * Der Request-Body benötigt keine Parameter.
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} response
 *
 */
app.post('/v1/startup', async (req: Request, res: Response) => {
    const response = await startUp();
    res.status(200).json({ message: 'Server is filled with example Data' });
});