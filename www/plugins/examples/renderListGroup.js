const { stripIndent } = require('common-tags')

module.exports = function (widgetName) {
  return stripIndent`
    import { ${widgetName} } from 'react-widgets';

    let people = listOfPeople();

    <${widgetName}
      data={people}
      textField='fullName'
      groupBy={person => person.fullName.length}
      renderListGroup={ ({ group }) => (
        <span>{group + ' letters long'}</span>
      )}
    />
  `
}
