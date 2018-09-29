import $ from 'jquery'
import get from 'service/get'
import post from 'service/post'
import getQuery from 'service/getQuery'

import common from './common'

import './../css/index.scss'

$(() => {
  const userId = getQuery('userId');
  
  let name = ''
  let phone = ''
  let id = ''
  let image = ''
  let back = ''

  function getAuthenInfo() {
    get.getAuthenInfo(userId).then(res => {
      const status = res.data.status
      if (status == -1) {
        $('.wrapper').removeClass('hidden')
        uploader.init()
        backUploader.init()
      } else if (status == 0 || status == 1) {
        location.href = '/result?status='+ status;
      } else if (status == 2) {
        $('.wrapper').removeClass('hidden')
        common.showNotify('您提交的实名认证审核未通过, 请重新提交')
        uploader.init()
        backUploader.init()
      }
    })
  }

  function upload() {
    if (!name || !phone || !id || !image || !back) {
      $('.error').show();
      return
    }
    post.authentication({
      name,
      phone,
      idNumber: id,
      picUrl: image,
      picUrlBack: back,
      userId,
    }).then(res => {
      if (res.result) {
        common.showNotify('上传成功, 请等待审核', common.shutPage);
      } else {
        common.showNotify('上传失败, 请重试');
      }
    }).catch(err => {
      common.showNotify('网络请求失败, 请稍后重试', common.shutPage);
    })
  }

  $('#name').on('change', function() {
    name = $(this).val()
  });

  $('#phone').on('change', function() {
    phone = $(this).val()
  });

  $('#id').on('change', function() {
    id = $(this).val()
  });

  const ossUrl = 'http://linktalk-img.oss-ap-southeast-1.aliyuncs.com/'
  const access_key_id = 'LTAIaiyznNnx7Gvu'
  const access_key_secret = 'CCKn0tKD8gw8GtsXG7XmSOZICPim7w'
  
  const policyText = {
    expiration: "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
    conditions: [
      ['content-length-range', 0, 1048576000], // 设置上传文件的大小限制
    ],
  };

  const policyBase64 = Base64.encode(JSON.stringify(policyText));
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, access_key_secret, { asBytes: true });
  const signature = Crypto.util.bytesToBase64(bytes);

  const uploader = new plupload.Uploader({
    runtimes : 'html5,flash,silverlight,html4',
    browse_button : 'uploaderButton',
    container: document.getElementById('uploadContainer'),
    url : ossUrl,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    multipart_params: {
      Filename: '${filename}',
      key: '${filename}',
      policy: policyBase64,
      OSSAccessKeyId: access_key_id,
      success_action_status: '200',
      signature,
    },

    init: {
      PostInit() {

      },
      FilesAdded(up, files) {
        if (files[0].type.indexOf('image') < 0) {
          common.showNotify('仅支持图片格式, 请重新选择');
          return;
        }
        uploader.start();
        $('#imagePreview').html('');
        $('#uploaderButton').html('<span>上传中...</span>');
        image = '';
      },
      FileUploaded(up, file, info) {
        if (info.status >= 200 || info.status < 200) {
          image = 'http://linktalk-img.mmcoco.com/' + file.name;
          $('#imagePreview').html(`<img src="${image}"/>`);
          $('#uploaderButton').html('<span>重新上传</span>');
        } else {
          alert('上传失败')
        }
      },
    },
  })

  const backUploader = new plupload.Uploader({
    runtimes : 'html5,flash,silverlight,html4',
    browse_button : 'backUpBtn',
    container: document.getElementById('backUploader'),
    url : ossUrl,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    multipart_params: {
      Filename: '${filename}',
      key: '${filename}',
      policy: policyBase64,
      OSSAccessKeyId: access_key_id,
      success_action_status: '200',
      signature,
    },

    init: {
      PostInit() {

      },
      FilesAdded(up, files) {
        if (files[0].type.indexOf('image') < 0) {
          common.showNotify('仅支持图片格式, 请重新选择');
          return;
        }
        backUploader.start();
        $('#backPreview').html('');
        $('#backUpBtn').html('<span>上传中...</span>');
        back = '';
      },
      FileUploaded(up, file, info) {
        if (info.status >= 200 || info.status < 200) {
          back = 'http://linktalk-img.mmcoco.com/' + file.name;
          $('#backPreview').html(`<img src="${back}"/>`);
          $('#backUpBtn').html('<span>重新上传</span>');
        } else {
          alert('上传失败')
        }
      },
    },
  })

  $('.button').click(upload);

  getAuthenInfo()
});