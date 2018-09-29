import $ from 'jquery'
import getQuery from 'service/getQuery'

import common from './common'

import './../css/result.scss'

$(() => {
  const status = getQuery('status')

  function showPage() {
    let text = ''
    let icon = ''
    if (status == 0 || status == 1) {
      $('.wrapper').removeClass('hidden')
      if (status == 0) {
        text = '实名认证审核中, 请耐心等候'
        icon = 'wait'
      }
      if (status == 1) {
        text = '您的认证申请已通过审核！'
        icon = 'success'
      }
      $('h3').text(text).addClass(icon)
      $('.icon').addClass(icon)
      $('button').on('click', common.shutPage)
    }
  }

  showPage()
});