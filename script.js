// Supabase init
const supabaseUrl = "https://wvbgpnepliihplacnlmp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2YmdwbmVwbGlpaHBsYWNubG1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwODU0OTUsImV4cCI6MjA2OTY2MTQ5NX0.EkTXvzCacTTqknOZhZrzBU7Ml0RzVHnrOIS2x1dRBBI";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Popola selezione persone
const personeBox = document.getElementById("personeSelector");
let personeSelezionate = null;

for (let i = 1; i <= 8; i++) {
    const btn = document.createElement("div");
    btn.classList.add("persone-btn");
    btn.innerText = i;

    btn.onclick = () => {
        document.querySelectorAll(".persone-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        personeSelezionate = i;
    };

    personeBox.appendChild(btn);
}

// Impedisce date antecedenti
const inputData = document.getElementById("giorno");
const oggi = new Date().toISOString().split("T")[0];
inputData.min = oggi;

// Turni e orari
const turnoSel = document.getElementById("turno");
const orarioSel = document.getElementById("orario");

turnoSel.addEventListener("change", () => {
    const turno = turnoSel.value;
    orarioSel.innerHTML = "";

    let orari = turno === "pranzo"
        ? ["12:00", "12:30", "13:00", "13:30", "14:00"]
        : ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];

    orari.forEach(o => {
        const opt = document.createElement("option");
        opt.value = o;
        opt.innerText = o;
        orarioSel.appendChild(opt);
    });
});

// Invia prenotazione
document.getElementById("prenotaForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!personeSelezionate) {
        alert("Seleziona il numero di persone");
        return;
    }

    const giorno = document.getElementById("giorno").value;
    const ora = orarioSel.value;

    // Correzione: timestamptz valido ISO
    const quandoISO = new Date(`${giorno}T${ora}:00`).toISOString();

    const { data, error } = await supabase
        .from("prenotazioni")
        .insert({
            ristorante_id: "2753f121-5c1e-4b85-b1f2-9b3bde1dbc86",
            cliente_nome: document.getElementById("cliente_nome").value,
            persone: personeSelezionate,
            turno: turnoSel.value,
            stato: "in_attesa",
            quando: quandoISO
    });


    if (error) {
        console.error(error);
        alert("Errore nell’invio della prenotazione");
        return;
    }

    // Mostra animazione successo
    document.getElementById("successOverlay").style.display = "flex";
});
