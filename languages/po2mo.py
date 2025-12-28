#!/usr/bin/env python3
"""
Simple PO to MO converter
This script converts a .po file to a .mo file without external dependencies.
"""

import struct
import array
import sys


def parse_po_file(po_file):
    """Parse a .po file and return a dictionary of translations."""
    translations = {}
    current_msgid = None
    current_msgstr = None
    in_msgid = False
    in_msgstr = False

    with open(po_file, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()

            # Skip comments and empty lines
            if line.startswith('#') or not line:
                if current_msgid is not None and current_msgstr is not None:
                    if current_msgid:  # Skip empty msgid (header)
                        translations[current_msgid] = current_msgstr
                    current_msgid = None
                    current_msgstr = None
                    in_msgid = False
                    in_msgstr = False
                continue

            # Start of msgid
            if line.startswith('msgid '):
                if current_msgid is not None and current_msgstr is not None:
                    if current_msgid:
                        translations[current_msgid] = current_msgstr
                current_msgid = line[6:].strip('"')
                current_msgstr = None
                in_msgid = True
                in_msgstr = False
            # Start of msgstr
            elif line.startswith('msgstr '):
                current_msgstr = line[7:].strip('"')
                in_msgid = False
                in_msgstr = True
            # Continuation line
            elif line.startswith('"'):
                content = line.strip('"')
                if in_msgid:
                    current_msgid += content
                elif in_msgstr:
                    current_msgstr += content

        # Add last entry
        if current_msgid is not None and current_msgstr is not None:
            if current_msgid:
                translations[current_msgid] = current_msgstr

    return translations


def generate_mo_file(translations, mo_file):
    """Generate a .mo file from translations dictionary."""
    # Sort translations by key for binary search
    keys = sorted(translations.keys())
    offsets = []
    ids = b''
    strs = b''

    for key in keys:
        # Add msgid
        offsets.append((len(ids), len(key), len(strs), len(translations[key])))
        ids += key.encode('utf-8') + b'\x00'
        strs += translations[key].encode('utf-8') + b'\x00'

    # Generate .mo file header
    keystart = 7 * 4 + 16 * len(keys)
    valuestart = keystart + len(ids)

    # Build the output
    output = struct.pack(
        'Iiiiiii',
        0x950412de,           # Magic number
        0,                     # Version
        len(keys),            # Number of entries
        7 * 4,                # Offset of table with original strings
        7 * 4 + 8 * len(keys), # Offset of table with translation strings
        0,                     # Size of hashing table
        0                      # Offset of hashing table
    )

    # Add keys index
    for o1, l1, o2, l2 in offsets:
        output += struct.pack('ii', l1, o1 + keystart)

    # Add values index
    for o1, l1, o2, l2 in offsets:
        output += struct.pack('ii', l2, o2 + valuestart)

    # Add keys and values
    output += ids
    output += strs

    with open(mo_file, 'wb') as f:
        f.write(output)


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print(f'Usage: {sys.argv[0]} <input.po> <output.mo>')
        sys.exit(1)

    po_file = sys.argv[1]
    mo_file = sys.argv[2]

    translations = parse_po_file(po_file)
    generate_mo_file(translations, mo_file)

    print(f'Generated {mo_file} with {len(translations)} translations')
