import {
    Line,
    mixins
} from 'vue-chartjs'

export default {
    extends: Line,
    mixins: [mixins.reactiveProp],
    props: ["options"],

    mounted() {
        this.renderChart(this.chartData, this.options)
    },
    /*
    watch: {
        chartData: function (newData, oldData) {
            console.log('new data from watcher', newData)
            //this._chart.destroy();
            //this._data._chart.destroy();
            //this.$data._chart.destroy()
            this.renderChart(this.newData, this.options)
        }
    }
*/
}