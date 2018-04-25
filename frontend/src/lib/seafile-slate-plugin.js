import { Editor, getEventTransfer, getEventRange } from 'slate-react';
import isUrl from 'is-url';
import { Inline, Text } from 'slate';


function SeafileSlatePlugin(options) {
  let {
    editCode
  } = options;

  return {



    /**
    * Get the block type for a series of auto-markdown shortcut `chars`.
    *
    * @param {String} chars
    * @return {String} block
    */
    getType(chars) {
      switch (chars) {
        case '*':
        case '-':
        case '+':
        case '1.':
        return 'list_item'
        case '>':
        return 'block-quote'
        case '#':
        return 'header_one'
        case '##':
        return 'header_two'
        case '###':
        return 'header_three'
        case '####':
        return 'header_four'
        case '#####':
        return 'header_five'
        case '######':
        return 'header_six'
        default:
        return null
      }
    },

    /**
    * On return, if at the end of a node type that should not be extended,
    * create a new paragraph below it.
    *
    * @param {Event} event
    * @param {Change} change
    */

    onEnter(event, change) {
      const { value } = change
      if (value.isExpanded) return

      const { startBlock, startOffset, endOffset } = value
      /*
      if (startOffset === 0 && startBlock.text.length === 0)
        return this.onBackspace(event, change)
      */
      //console.log(startBlock)
      if (endOffset !== startBlock.text.length) return

      /* enter code block if put ``` */
      if (startBlock.text === '```') {
        event.preventDefault()
        editCode.changes.wrapCodeBlockByKey(change, startBlock.key)
        // move the cursor to the start of new code block
        change.collapseToStartOf(change.value.document.getDescendant(startBlock.key))
        // remove string '```'
        change.deleteForward(3)
        return true
      }

      /* enter hr block if put *** or --- */
      if (startBlock.text === '***' || startBlock.text === '---') {
        event.preventDefault()
        change.removeNodeByKey(startBlock.key).insertBlock({
          type: 'hr',
          isVoid: true
        }).collapseToStartOfNextBlock()
        return true
      }

      // create a paragraph node after 'enter' after a header line
      if (
        startBlock.type !== 'header_one' &&
        startBlock.type !== 'header_two' &&
        startBlock.type !== 'header_three' &&
        startBlock.type !== 'header_four' &&
        startBlock.type !== 'header_five' &&
        startBlock.type !== 'header_six' &&
        startBlock.type !== 'block-quote'
      ) {
        return;
      }

      event.preventDefault()
      change.splitBlock().setBlocks('paragraph')
      return true
    },

    /**
    * On space, if it was after an auto-markdown shortcut, convert the current
    * node into the shortcut's corresponding type.
    *
    * @param {Event} event
    * @param {Change} change
    */
    onSpace(event, change) {
      const { value } = change
      if (value.isExpanded) return

      const { startBlock, startOffset } = value
      const chars = startBlock.text.slice(0, startOffset).replace(/\s*/g, '')
      const type = this.getType(chars)

      if (!type) return
      if (type === 'list_item' && startBlock.type === 'list_item') return
      event.preventDefault()

      change.setBlocks(type)

      if (type === 'list_item') {
        if (chars === "1.") {
          change.wrapBlock('ordered_list')
        } else {
          change.wrapBlock('unordered_list')
        }
      }

      change.extendToStartOf(startBlock).delete()
      return true
    },

    /**
    * On backspace, if at the start of a non-paragraph, convert it back into a
    * paragraph node.
    *
    * @param {Event} event
    * @param {Change} change
    */
    onBackspace(event, change) {
      return;
      /*
      const { value } = change
      if (value.isExpanded) return
      if (value.startOffset !== 0) return

      const { startBlock } = value
      console.log(startBlock.type)
      if (startBlock.type !== 'paragraph') return


      event.preventDefault()
      change.setBlocks('paragraph')

      const { document } = value
      if (startBlock.type === 'list-item') {
        const pNode = document.getParent(startBlock.key)
        // unwrap the parent 'numbered-list' or 'bulleted-list'
        change.unwrapBlock(pNode.type)
      }

      return true
      */
    },


    onKeyDown(event, change, editor) {
      switch (event.key) {
        case 'Enter':
          return this.onEnter(event, change);
        case ' ':
          return this.onSpace(event, change);
        case 'Backspace':
          return this.onBackspace(event, change);
      }
    },

    onDrop(event, change, editor) {
      const transfer = getEventTransfer(event);
      const range = getEventRange(event, change.value);
      switch (transfer.type) {
        case 'text': {
          const { text } = transfer;
          if (!isUrl(text))
            return;
          if (text.endsWith("png?raw=1") || text.endsWith("png?raw=1")
            || text.endsWith("jpg?raw=1") || text.endsWith("JPG?raw=1") ) {
            // a special URL from seafile server
            var node = Inline.create({
              type: 'image',
              isVoid: true,
              data: {
                src: text
              }
            });
            change.insertInline(node);
            return true;
          }

          if (editor.props.editorUtilities.isInternalFileLink(text)) {
            let index = text.lastIndexOf("/");
            if (index == -1) {
              return;
            }
            var fileName = text.substring(index + 1);
            var t = Text.create({
              text: fileName
            });
            var node = Inline.create({
              type: 'link',
              data: {
                href: text
              },
              nodes: [t]
            });
            change.insertInline(node);
            return true;
          }

        }
      }
    }

  }
}

export default SeafileSlatePlugin;
