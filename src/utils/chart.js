export const getEvents = () => ({
  mounted() {
    window.dispatchEvent(new Event('resize'));
  },
});

export const numberFormatter = (num, digits = 2) => {
  const si = [
    { value: 1, symbol: '' },
    { value: 1E3, symbol: 'k' },
    { value: 1E6, symbol: 'M' },
    { value: 1E9, symbol: 'G' },
    { value: 1E12, symbol: 'T' },
    { value: 1E15, symbol: 'P' },
    { value: 1E18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i -= 1) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, '$1') + si[i].symbol;
};

export const getCompareTooltip = (formatter = null) => ({
  custom: ({
    series,
    dataPointIndex,
    w,
  }) => `
    <span class="custom-chart-tooltip tooltip-item">
        <span class="apexcharts-tooltip-marker" style="background-color: ${w.config.colors[0]}"></span>
        <span>${formatter ? formatter(series[0][dataPointIndex], dataPointIndex, 0) : series[0][dataPointIndex]}</span>
    </span>
    <span class="custom-chart-tooltip tooltip-item --darken">
        <span class="apexcharts-tooltip-marker" style="background-color: ${w.config.colors[1]}"></span>
        <span>${formatter ? formatter(series[1][dataPointIndex], dataPointIndex, 1) : series[1][dataPointIndex]}</span>
    </span>
    `,
});

export const getPaceTooltip = (nightsFormatter = null, rateFormatter = null) => ({
  custom: ({
    series,
    dataPointIndex,
    w,
  }) => `
    <span class="custom-chart-tooltip tooltip-item">
        <span class="apexcharts-tooltip-marker" style="background-color: ${w.config.colors[0]}"></span>
        <span>${nightsFormatter ? nightsFormatter(series[0][dataPointIndex]) : series[0][dataPointIndex]}</span>
    </span>
    <span class="custom-chart-tooltip tooltip-item">
        <span class="apexcharts-tooltip-marker --line" style="background-color: ${w.config.colors[1]};color: ${w.config.colors[1]}"></span>
        <span>${rateFormatter ? rateFormatter(series[1][dataPointIndex]) : series[1][dataPointIndex]}</span>
    </span>
    <span class="custom-chart-tooltip tooltip-item --darken">
        <span class="apexcharts-tooltip-marker" style="background-color: ${w.config.colors[2]}"></span>
        <span>${nightsFormatter ? nightsFormatter(series[2][dataPointIndex]) : series[2][dataPointIndex]}</span>
    </span>
    <span class="custom-chart-tooltip tooltip-item --darken">
        <span class="apexcharts-tooltip-marker --line" style="background-color: ${w.config.colors[3]};color: ${w.config.colors[3]}"></span>
        <span>${rateFormatter ? rateFormatter(series[3][dataPointIndex]) : series[3][dataPointIndex]}</span>
    </span>
    `,
});

export const getStates = () => ({
  active: {
    filter: {
      type: 'none',
    },
  },
});

export default {
  getEvents,
  getCompareTooltip,
  getPaceTooltip,
  getStates,
};
