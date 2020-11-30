import { VantComponent } from '../../../common/component';
import {
  getMonthEndDay,
  compareDay,
  getPrevDay,
  getNextDay,
} from '../../utils';
VantComponent({
  props: {
    date: {
      type: null,
      observer: 'setDays',
      // surplusList: [
      //   {
      //     "currentDate": "2020-10-08",
      //     "remainCapacity": 20000
      //   },
      //   {
      //     "currentDate": "2020-10-09",
      //     "remainCapacity": 20000
      //   },
      //   {
      //     "currentDate": "2020-10-10",
      //     "remainCapacity": 20000
      //   },
      //   {
      //     "currentDate": "2020-10-11",
      //     "remainCapacity": 20000
      //   },
      //   {
      //     "currentDate": "2020-10-12",
      //     "remainCapacity": 20000
      //   },
      //   {
      //     "currentDate": "2020-10-13",
      //     "remainCapacity": 20000
      //   },
      //   {
      //     "currentDate": "2020-10-14",
      //     "remainCapacity": 20000
      //   },
      //   {
      //     "currentDate": "2020-10-15",
      //     "remainCapacity": 20000
      //   },
      //   {
      //     "currentDate": "2020-10-16",
      //     "remainCapacity": 20000
      //   },
      //   {
      //     "currentDate": "2020-10-17",
      //     "remainCapacity": 20000
      //   }
      // ],
    },
    type: {
      type: String,
      observer: 'setDays',
    },
    color: String,
    minDate: {
      type: null,
      observer: 'setDays',
    },
    maxDate: {
      type: null,
      observer: 'setDays',
    },
    showMark: Boolean,
    rowHeight: [Number, String],
    formatter: {
      type: null,
      observer: 'setDays',
    },
    currentDate: {
      type: [null, Array],
      observer: 'setDays',
    },
    dateList: {
      type: [null, Array],
      observer: 'setDays',
    },
    allowSameDay: Boolean,
    showSubtitle: Boolean,
    showMonthTitle: Boolean,
  },
  data: {
    visible: true,
    days: [],
  },
  methods: {
    onClick(event) {
      const { index } = event.currentTarget.dataset;
      const item = this.data.days[index];
      if (item.type !== 'disabled') {
        this.$emit('click', item);
      }
    },
    setDays() {
      const days = [];
      const startDate = new Date(this.data.date);
      const year = startDate.getFullYear();
      const month = startDate.getMonth();
      const totalDay = getMonthEndDay(
        startDate.getFullYear(),
        startDate.getMonth() + 1
      );
      // console.log(year, month,'year, month, day');
      
      for (let day = 1; day <= totalDay; day++) {
        const date = new Date(year, month, day);
        const type = this.getDayType(date);
        const remainCapacity = this.getRemainCapacity(year, month, day)
          
        let config = {
          remainCapacity,
          date,
          type,
          text: day,
          bottomInfo: this.getBottomInfo(type),
        };
        if (this.data.formatter) {
          config = this.data.formatter(config);
        }
        days.push(config);
      }
      console.log(days,'daysdaysdaysdaysdays');

      this.setData({ days });
    },
    getRemainCapacity(year, month, day){
      const dateList  = this.data.dateList;
      // console.log(dateList,'dateList');
      if (!Array.isArray(dateList)) {
        return '';
      }
      var r = ''
      dateList.map((item,i) => {
        var currentDateList = item.date.split('-')
        if(currentDateList[0] == year&& currentDateList[1] == (month+1) && Number(currentDateList[2]) == day){
          var n = 0
          item.timeList.map((it)=>{
            console.log(year, month, day, it.receptionQuantity, 'month====================');
            n += it.receptionQuantity
          })

          r = n
        }
      })
      // dateList.map((item,i) => {
      //   var currentDateList = item.currentDate.split('-')
      //   if(currentDateList[0] == year&& currentDateList[1] == (month+1) && Number(currentDateList[2]) == day){
      //     console.log(year,month,day,'month====================');
      //     r = item.remainCapacity
      //   }
      // })
      return r
    },
    getMultipleDayType(day) {
      const { currentDate } = this.data;
      if (!Array.isArray(currentDate)) {
        return '';
      }
      const isSelected = (date) =>
        currentDate.some((item) => compareDay(item, date) === 0);
      if (isSelected(day)) {
        const prevDay = getPrevDay(day);
        const nextDay = getNextDay(day);
        const prevSelected = isSelected(prevDay);
        const nextSelected = isSelected(nextDay);
        if (prevSelected && nextSelected) {
          return 'multiple-middle';
        }
        if (prevSelected) {
          return 'end';
        }
        return nextSelected ? 'start' : 'multiple-selected';
      }
      return '';
    },
    getRangeDayType(day) {
      const { currentDate, allowSameDay } = this.data;
      if (!Array.isArray(currentDate)) {
        return;
      }
      const [startDay, endDay] = currentDate;
      if (!startDay) {
        return;
      }
      const compareToStart = compareDay(day, startDay);
      if (!endDay) {
        return compareToStart === 0 ? 'start' : '';
      }
      const compareToEnd = compareDay(day, endDay);
      if (compareToStart === 0 && compareToEnd === 0 && allowSameDay) {
        return 'start-end';
      }
      if (compareToStart === 0) {
        return 'start';
      }
      if (compareToEnd === 0) {
        return 'end';
      }
      if (compareToStart > 0 && compareToEnd < 0) {
        return 'middle';
      }
    },
    getDayType(day) {
      const { type, minDate, maxDate, currentDate } = this.data;
      if (compareDay(day, minDate) < 0 || compareDay(day, maxDate) > 0) {
        return 'disabled';
      }
      if (type === 'single') {
        return compareDay(day, currentDate) === 0 ? 'selected' : '';
      }
      if (type === 'multiple') {
        return this.getMultipleDayType(day);
      }
      /* istanbul ignore else */
      if (type === 'range') {
        return this.getRangeDayType(day);
      }
    },
    getBottomInfo(type) {
      if (this.data.type === 'range') {
        if (type === 'start') {
          return '开始';
        }
        if (type === 'end') {
          return '结束';
        }
        if (type === 'start-end') {
          return '开始/结束';
        }
      }
    },
  },
});
