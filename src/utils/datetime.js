export function formatDate(date) {
    var d = new Date(date)
    var month = '' + (d.getMonth() + 1)
    var day = '' + d.getDate()
    var year = d.getFullYear()

    if (month.length < 2) {
      month = '0' + month
    }
    if (day.length < 2) {
      day = '0' + day
    }

    return [year, month, day].join('-')
}

export function formatTime(date) {
    var d = new Date(date)
    var hour = '' + d.getHours()
    var minute = '' + d.getMinutes()

    if (hour.length < 2) {
      hour = '0' + hour
    }
    if (minute.length < 2) {
      minute = '0' + minute
    }

    return [hour, minute, '00'].join(':')
}

export function formatDateTime(date) {
    return [formatDate(date), formatTime(date)].join(' ')
}
