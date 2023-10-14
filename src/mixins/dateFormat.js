import format from 'date-fns/format';

export default {
    methods: {
        dateFormat(time, fmt = 'yyyy-MM-dd HH:mm:ss') {
            return format(new Date(time), fmt);
        },
    },
};
