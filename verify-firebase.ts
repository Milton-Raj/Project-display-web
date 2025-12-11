import { getAllProjects } from './lib/database';

async function verify() {
    console.log("Attempting to connect to Firebase...");
    try {
        const projects = await getAllProjects();
        console.log("Successfully connected! Found projects:", projects.length);
        process.exit(0);
    } catch (error) {
        console.error("Connection failed:", error);
        process.exit(1);
    }
}

verify();
