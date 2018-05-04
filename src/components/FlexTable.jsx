import React from 'react';
import PropTypes from 'prop-types';

export default class FlexTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  sortData(key) {
    // Populate sortWith
    let sortWith = {};
    let sortKey = key;
    if (this.state.sortWith) {
      sortWith = Object.assign({}, this.state.sortWith);
    }

    if (typeof key === 'string') {
      if (sortWith[key] !== undefined) {
        sortWith[key] *= -1;
      } else {
        sortWith[key] = 1;
      }
    } else {
      key = key.join(' ');
      sortKey = key;
      if (sortWith[key] !== undefined) {
        sortWith[key] *= -1;
      } else {
        sortWith[key] = 1;
      }
    }
    this.setState({ sortWith, sortKey });
  }

  render() {
    return (
      <div className="flextable">
        <div className="flextable-header">
          {this.props.fields.map((field, i) => {
            // Is column sortable?
            let handleClick; // undefined unless the column is sortable
            let cell = 'flextable-cell';
            if (field.sortWith) {
              cell = 'flextable-cell-clickable';
              if (this.state.sortKey) {
                const key =
                  typeof field.sortWith === 'string' ? field.sortWith : field.sortWith.join(' ');
                if (this.state.sortKey === key) {
                  cell += ' active';
                }
                if (this.state.sortWith[key]) {
                  cell += this.state.sortWith[key] > 0 ? ' sort-asc' : ' sort-desc';
                }
              }
              handleClick = () => this.sortData(field.sortWith);
            }

            // Apply additional classes to header if provided
            const className = field.titleClass ? `${cell} ${field.titleClass}` : cell;

            // Decide if column should be visible
            if (field.visible !== undefined && !field.visible) {
              return null;
            }

            // If a title has been specified use it
            if (field.title) {
              return (
                <div
                  key={i}
                  className={className}
                  style={field.grow ? { flexGrow: field.grow } : undefined}
                  onClick={handleClick}
                >
                  {field.title}
                </div>
              );
            }

            // If no title, but a Field object use name
            if (field.name) {
              const title = field.name.slice(0, 1).toUpperCase() + field.name.slice(1);
              return (
                <div
                  key={i}
                  className={className}
                  style={field.grow ? { flexGrow: field.grow } : undefined}
                  onClick={handleClick}
                >
                  {title}
                </div>
              );
            }

            // Otherwise return the string
            const title = field.slice(0, 1).toUpperCase() + field.slice(1);
            return (
              <div
                key={i}
                className="flextable-cell"
                style={field.grow ? { flexGrow: field.grow } : undefined}
                onClick={handleClick}
              >
                {title}
              </div>
            );
          })}
        </div>
        {this.props.data
          .sort((rowA, rowB) => {
            // If a sortKey is present sort using that value
            if (this.state.sortKey) {
              const sortWith = this.state.sortKey.split(' ');
              let sortVal = 0;
              for (let i = 0; i < sortWith.length; i++) {
                if (rowA[sortWith[i]] > rowB[sortWith[i]]) sortVal = 1;
                if (rowA[sortWith[i]] < rowB[sortWith[i]]) sortVal = -1;
                if (sortVal !== 0) {
                  return sortVal * this.state.sortWith[this.state.sortKey];
                }
              }
              return sortVal;
              // Otherwise if there is a defaultSort provided sort using that value
            } else if (this.props.defaultSort && this.state.sortKey === undefined) {
              if (typeof this.props.defaultSort === 'string') {
                if (rowA[this.props.defaultSort] > rowB[this.props.defaultSort]) return 1;
                if (rowA[this.props.defaultSort] < rowB[this.props.defaultSort]) return -1;
                return 0;
              }

              let sortVal = 0;
              for (let i = 0; i < this.props.defaultSort.length; i++) {
                if (rowA[this.props.defaultSort[i]] > rowB[this.props.defaultSort[i]]) sortVal = 1;
                if (rowA[this.props.defaultSort[i]] < rowB[this.props.defaultSort[i]]) sortVal = -1;
                if (sortVal !== 0) {
                  return sortVal;
                }
              }
            }
            return 0;
          })
          .map((row, i) => (
            <div key={i} className="flextable-row">
              {this.props.fields.map((item, j) => {
                // Apply additional classes to data if provided
                let className = item.dataClass
                  ? `flextable-cell ${item.dataClass}`
                  : 'flextable-cell';

                // If a formatter callback was provided run row through the callback
                if (item.formatter && item.formatter(row)) {
                  className += ` ${item.formatter(row)}`;
                }

                // Decide if data should be visible
                if (item.visible !== undefined && !item.visible) {
                  return null;
                }

                if (item.data) {
                  const field = item.name ? item.name : item;
                  const props = { row, field };
                  return (
                    <div
                      key={j}
                      className={className}
                      style={item.grow ? { flexGrow: item.grow } : undefined}
                    >
                      {React.cloneElement(item.data, props)}
                    </div>
                  );
                }

                if (item.name) {
                  return (
                    <div
                      key={j}
                      className={className}
                      style={item.grow ? { flexGrow: item.grow } : undefined}
                    >
                      {row[item.name]}
                    </div>
                  );
                }
                return (
                  <div key={j} className="flextable-cell">
                    {row[item]}
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    );
  }
}

FlexTable.propTypes = {
  data: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  defaultSort: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
};
