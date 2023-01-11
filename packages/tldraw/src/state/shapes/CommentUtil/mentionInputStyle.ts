export default {
    control: {
      backgroundColor: '#fff',
      fontSize: 16,
      // fontWeight: 'normal',
    },
    '&multiLine': {
      control: {
        fontFamily: 'Graphik Web',
        minHeight: 63,
      },
      highlighter: {
        padding: 9,
        border: 'none',
      },
      input: {
        padding: 9,
        border: 'none',
      },
    },
    '&singleLine': {
      display: 'inline-block',
      width: 180,
      highlighter: {
        padding: 1,
        border: 'none',
        outine:'none'
      },
      input: {
        padding: 1,
        border: 'none',
        outline: 'none'
      },
    },
    suggestions: {
      list: {
        backgroundColor: 'white',
        borderRadius: '4px',
        boxShadow: '0px 2px 12px rgba(19, 23, 32, 0.08)',
        fontFamily:'Graphik Web',
        overflow:'auto',
        pointerEvents: 'all',

      },
      item: {
        pointerEvents: 'all',
        fontFamily:'Graphik Web',
        padding: '12px 16px',
        '&focused': {
          backgroundColor: '#F6F7F9',
        },
      },
    },
  }