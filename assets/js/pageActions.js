document.addEventListener("DOMContentLoaded", function() {
    // Create action to get the ETL (Extract Transfer Load) last change dates
    fetch('https://www.waterqualitydata.us/data/lastETL')
        .then(response => response.json())
        .then(success => setValues(success.lastEtlRun));

    function setValues(success) {
        for (let item in success) {
            if (success[item].provider === "STEWARDS") {
                const span = document.getElementById("arsETL");
                const dateString = formatDate(success[item].time)
                span.textContent = dateString;
            }
            if (success[item].provider === "NWIS") {
                const span = document.getElementById("usgsETL");
                const dateString = formatDate(success[item].time)
                span.textContent = dateString;
            }
            if (success[item].provider === "STORET") {
                const span = document.getElementById("epaETL");
                const dateString = formatDate(success[item].time)
                span.textContent = dateString;
            }
        }
    }
    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    // Create action to set event handler to remove the 'New User Interface' alert
    const announcement = document.getElementById("siteAnnouncement")
    const announcementCloseButton = document.getElementById("close-announcement")
    announcementCloseButton.onclick = function() {
        announcement.remove();
    }
});
