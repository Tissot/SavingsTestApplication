'use strict'

import { PureComponent } from 'react'

import I18n from 'react-native-i18n'
import zhHans from './locales/zh-hans'
import zhHant from './locales/zh-hant'

I18n.fallbacks = true
I18n.defaultLocale = 'zhHant'

I18n.translations = {
  zhHant,
  zhHans
}

PureComponent.prototype.$i18n = I18n

export default I18n;
