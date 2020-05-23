export default {
    methods: {
        toReadebleDate: function (date) {
            let dateObj
            if (isNaN(date)) {
                dateObj = new Date(date);
            } else {
                dateObj = new Date(date * 1000);
            }
            return dateObj.getDate() + '. ' + (dateObj.getMonth() + 1) + '. ' + dateObj.getFullYear();
        }
    }
}

