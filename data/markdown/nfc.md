## The Web NFC API

Web NFC aims to provide sites the ability to read and write to nearby NFC (Near Field Communication) tags in a secure and privacy preserving manner.

NFC consists of a rather large set of technologies, so for this first iteration of the API the focus has been on supporting the NFC Data Exchange Format aka NDEF, a lightweight binary message format, as it works across different tag formats.

Web NFC is only available to top-level, secure browsing contexts, and origins must first request the “nfc” permission while handling a user gesture. To then perform a read or write, the web page must be visible when the user touches an NFC tag with their device. The browser uses haptic feedback to indicate a tap. Access to the NFC radio is blocked if the display is off or the device is locked. For backgrounded web pages, receiving and pushing NFC content are suspended.

Web NFC provides an easy to use API that web developers will be comfortable with, and at the same time that it is low-level and flexible enough so that users can get the full potential out of NDEF and even integrate with legacy solutions.
