const dateTimeFormats = {
  en: {
    short: { year: "numeric", month: "short", day: "numeric" },
    long: { year: "numeric", month: "long", day: "numeric" }
  },
  fr: {
    short: { year: "numeric", month: "short", day: "numeric" },
    long: { year: "numeric", month: "long", day: "numeric" },
  }
}

// in template : {{ $d( new Date('2020/09/08'), "short/long/null" ) }}

export default dateTimeFormats