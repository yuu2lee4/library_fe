import format from 'date-fns/format';

export default {
    methods: {
        dateFormat(time, fmt = 'YYYY-MM-DD HH:mm:ss') {
            return format(new Date(time), fmt);
        },
    },
};
