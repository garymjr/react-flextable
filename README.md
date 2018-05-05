# react-flextable

## Props
### # data
- type: *Array*

The data to be displayed in the table. Stored as an array of objects.

### # fields
- type: *Array*

The fields (columns) to be displayed in the table. Can be stored as an array of<br/>
strings or an array of [Field](#field) objects.

### # defaultSort
- type: *String* | *Array*

Determines the default sorting order of the table. Can be stored as a single<br/>
field or an array of fields.


## <a name="field"></a> Field
### # name
- type: *String*

The name of the key to pull the data for this field.

### # title
- type: *String* | *Element*

The string to use as the title for the column. Can be provided as a string or
React element.

### # titleClass
- type: *String*

Additional css classes to be applied to the title.

### # dataClass
- type: *String*

Additional css classes to be applied to the field.

### # sortWith
- type: *String* | *Array*

If specified the column becomes sortable using the provided values. If an array<br/>
is provided it will sort using all provided fields.

### # grow
- type: *Number*

If specified this value will override the default flex-flow value of 1.

### # formatter
- type: *Function*

A function that acts as a callback to format the field data.

### # customData
- type: *Element*

A React element to display instead of the data. If used it is provided the<br/>
current row and field as props to use within the custom element.
