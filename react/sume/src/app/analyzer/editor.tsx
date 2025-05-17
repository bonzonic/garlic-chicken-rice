import React, { useState, useMemo, useCallback } from 'react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';

const BasicEditor = () => {
  // Create a Slate editor object that won't change across renders
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  
  // Initial value - an array of "blocks" (paragraphs, etc.)
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: 'Start typing your document here...' }],
    },
  ]);

// Default element renderer - a paragraph
  const DefaultElement = props => {
    return <p {...props.attributes}>{props.children}</p>;
  };

  // Default leaf renderer - plain text
  const DefaultLeaf = props => {
    return <span {...props.attributes}>{props.children}</span>;
  };

  // Define a rendering function for custom elements (not needed for now)
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a rendering function for custom text formatting (not needed for now)
  const renderLeaf = useCallback(props => {
    return <DefaultLeaf {...props} />;
  }, []);


  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
        hehe
      {/* <Slate
        editor={editor}
        value={value}
        onChange={newValue => {
            if (Array.isArray(newValue)) {
                setValue(newValue);
            }
        }}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some text..."
          style={{ minHeight: '150px' }}
        />
      </Slate> */}
    </div>
  );
};

export default BasicEditor;