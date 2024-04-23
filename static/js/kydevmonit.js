{
  //打印类
  (Printer = {
    //A4打印机
    OfficePrinter: {
      socket: null,
      //连接美松打印机设备接口的回调函数
      OfficePrinterConnectedCB: function () {},
      //打开设备接口的回调函数
      openCompletedCB: function () {},
      //关闭设备接口的回调函数
      closeCompletedCB: function () {},
      //获取固件版本号接口的回调函数
      getFirmwareVersionCompletedCB: function () {},
      //获取设备状态接口的回调函数
      getDeviceStatusCompletedCB: function () {},
      //获取纸张状态接口的回调函数
      getPaperStatusCompletedCB: function () {},
      //获取墨水状态接口的回调函数
      getInkStatusCompletedCB: function () {},
      //打印文件接口的回调函数
      printFileCompletedCB: function () {},
      //取消打印任务接口的回调函数
      cancelJobCompletedCB: function () {},
      clearQueueCompletedCB: function () {},
      /**
       * WebSocket通讯连接A4打印机设备
       * @param callback (类型：void,说明：回调函数)
       */
      connected: function (callback) {
        OfficePrinterConnectedCB = callback;
        var that = this;
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
        that.socket = new WebSocket("ws://localhost:8083");
        that.socket.onopen = function () {
          new QWebChannel(that.socket, function (channel) {
            //获取A4打印机设备对象
            OfficePrinterObject = channel.objects.officePrinterXianHuaSP1020S;
            //打开设备接口返回的信号
            OfficePrinterObject.sig_opened.connect(function (return_code) {
              openCompletedCB(return_code);
            });
            //关闭设备接口返回的信号
            OfficePrinterObject.sig_closed.connect(function (return_code) {
              closeCompletedCB(return_code);
            });
            //获取固件版本接口返回的信号
            OfficePrinterObject.sig_getted_firmware_version.connect(function (
              return_code,
              firmware
            ) {
              getFirmwareVersionCompletedCB(return_code, firmware);
            });
            //获取设备状态接口返回的信号
            OfficePrinterObject.sig_getted_device_status.connect(function (
              return_code,
              status
            ) {
              getDeviceStatusCompletedCB(return_code, status);
            });
            //获取纸张状态接口返回的信号
            OfficePrinterObject.sig_getted_paper_status.connect(function (
              return_code,
              status
            ) {
              getPaperStatusCompletedCB(return_code, status);
            });
            //获取墨水状态接口返回的信号
            OfficePrinterObject.sig_getted_ink_status.connect(function (
              return_code,
              status
            ) {
              getInkStatusCompletedCB(return_code, status);
            });
            //打印文件接口返回的信号
            OfficePrinterObject.sig_printed_file.connect(function (
              return_code,
              job_id
            ) {
              printFileCompletedCB(return_code, job_id, "print");
            });
            //打印完成返回的信号
            OfficePrinterObject.sig_printed_status.connect(function (
              return_code,
              job_id
            ) {
              printFileCompletedCB(return_code, job_id, "printSuccess");
            });
            //取消打印任务接口返回的信号
            OfficePrinterObject.sig_canceled_job.connect(function (
              return_code
            ) {
              cancelJobCompletedCB(return_code);
            });
            //清空打印任务接口返回的信号
            OfficePrinterObject.sig_cleared_queue.connect(function (
              return_code
            ) {
              clearQueueCompletedCB(return_code);
            });
            if (typeof OfficePrinterConnectedCB == "function") {
              OfficePrinterConnectedCB();
            }
          });
        };
        that.socket.onclose = function () {
          console.log("serial board websocket disconnected.");
        };
      },
      /**
       * 打开设备
       * @param {void} callback 回调函数
       */
      open: function (callback) {
        openCompletedCB = callback;
        OfficePrinterObject.open(function (return_code) {
          if (0 != return_code) {
            openCompletedCB(return_code);
          }
        });
      },
      /**
       * 关闭设备
       * @param {void} callback 回调函数
       */
      close: function (callback) {
        closeCompletedCB = callback;
        OfficePrinterObject.close(function (return_code) {
          if (0 != return_code) {
            closeCompletedCB(return_code);
          }
        });
      },
      /**
       * 获取固件版本号
       * @param {void} callback 回调函数
       */
      getFirmwareVersion: function (callback) {
        getFirmwareVersionCompletedCB = callback;
        OfficePrinterObject.get_firmware_version(function (return_code) {
          if (0 != return_code) {
            getFirmwareVersionCompletedCB(return_code);
          }
        });
      },
      /**
       * 获取设备状态
       * @param {void} callback 回调函数
       */
      getDeviceStatus: function (callback) {
        getDeviceStatusCompletedCB = callback;
        OfficePrinterObject.get_device_status(function (return_code) {
          if (0 != return_code) {
            getDeviceStatusCompletedCB(return_code);
          }
        });
      },
      /**
       * 获取纸张状态
       * @param {void} callback 回调函数
       */
      getPaperStatus: function (callback) {
        getPaperStatusCompletedCB = callback;
        OfficePrinterObject.get_paper_status(function (return_code) {
          if (0 != return_code) {
            getPaperStatusCompletedCB(return_code);
          }
        });
      },
      /**
       * 获取墨水状态
       * @param {void} callback 回调函数
       */
      getInkStatus: function (callback) {
        getInkStatusCompletedCB = callback;
        OfficePrinterObject.get_ink_status(function (return_code) {
          if (0 != return_code) {
            getInkStatusCompletedCB(return_code);
          }
        });
      },
      /**
       * 打印文件
       * @param {string} file (文件绝对路径，仅支持PDF格式文件)
       * @param {void} callback 回调函数
       */
      printFile: function (file, callback) {
        printFileCompletedCB = callback;
        OfficePrinterObject.print_file(file, function (return_code) {
          if (0 != return_code) {
            printFileCompletedCB(return_code);
          }
        });
      },
      /**
       * 取消打印任务
       * @param {int} job_id (打印任务id)
       * @param {void} callback 回调函数
       */
      cancelJob: function (job_id, callback) {
        cancelJobCompletedCB = callback;
        OfficePrinterObject.cancel_job(job_id, function (return_code) {
          if (0 != return_code) {
            cancelJobCompletedCB(return_code);
          }
        });
      },
      /**
       * 清空打印任务
       * @param {void} callback 回调函数
       */
      clearQueue: function (callback) {
        clearQueueCompletedCB = callback;
        OfficePrinterObject.clear_queue(function (return_code) {
          if (0 != return_code) {
            clearQueueCompletedCB(return_code);
          }
        });
      },
    },
    //美松打印机
    ThermalPrinter: {
      //连接美松打印机设备接口的回调函数
      thermalPrinterConnectedCB: function () {},
      //打开设备接口的回调函数
      openCompletedCB: function () {},
      //关闭设备接口的回调函数
      closeCompletedCB: function () {},
      //重置设备接口的回调函数
      resetCompletedCB: function () {},
      //获取固件版本接口的回调函数
      getFirmwareVersionCompletedCB: function () {},
      //获取设备状态接口的回调函数
      getDeviceStatusCompletedCB: function () {},
      //获取纸张状态接口的回调函数
      getPaperStatusCompletedCB: function () {},
      //走纸接口的回调函数
      shortDistanceCompletedCB: function () {},
      //设置行间距接口的回调函数
      setLineSpaceCompletedCB: function () {},
      //设置字符间距接口的回调函数
      setCharactersSpaceCompletedCB: function () {},
      //设置左边距接口的回调函数
      setLeftMarginCompletedCB: function () {},
      //设置文本放大接口的回调函数
      setTextSizeCompletedCB: function () {},
      //设置字符对齐方式接口的回调函数
      setAlignmentCompletedCB: function () {},
      //设置字体旋转接口的回调函数
      setRotateCompletedCB: function () {},
      //设置字体加粗接口的回调函数
      setBoldCompletedCB: function () {},
      //设置反色模式的回调函数
      setInverseColorModeCompletedCB: function () {},
      //设置字体斜体接口的回调函数
      setItalicCompletedCB: function () {},
      //设置下划线接口的回调函数
      setUnderlineCompletedCB: function () {},
      //切纸接口的回调函数
      cutPaperCompletedCB: function () {},
      //打印ASCII字符串接口的回调函数
      printAsciiStringCompletedCB: function () {},
      //打印中文字符串接口的回调函数
      printChineseStringCompletedCB: function () {},
      //打印条形码接口的回调函数
      printBarcodeCompletedCB: function () {},
      //打印QR二维码接口的回调函数
      printQrcodeCompletedCB: function () {},
      //打印位图接口的回调函数
      printBitmapCompletedCB: function () {},
      //设置 nv 位图接口的回调函数
      setNvBitmapCompletedCB: function () {},
      //打印nv位图接口的回调函数
      printNvBitmapCompletedCB: function () {},
      socket: null,
      /**
       * WebSocket通讯连接美松打印机设备
       * @param callback (类型：void,说明：回调函数)
       */
      connected: function (callback) {
        thermalPrinterConnectedCB = callback;
        var that = this;
        if (that.socket != null) {
          if (0 != that.socket.readyState) {
            that.socket.close();
          }
        }
        that.socket = new WebSocket("ws://localhost:8083");
        that.socket.onopen = function () {
          new QWebChannel(that.socket, function (channel) {
            //获取美松打印机对象
            thermalPrinterObject = channel.objects.thermalPtinterMSNP80A;
            //打开设备返回的信号
            thermalPrinterObject.sig_opened.connect(function (return_code) {
              openCompletedCB(return_code);
            });
            //关闭设备返回的信号
            thermalPrinterObject.sig_closed.connect(function (return_code) {
              closeCompletedCB(return_code);
            });
            //重置设备返回的信号
            thermalPrinterObject.sig_reset.connect(function (return_code) {
              resetCompletedCB(return_code);
            });
            //获取设备固件版本信息返回的信号
            thermalPrinterObject.sig_getted_firmware_version.connect(function (
              return_code,
              firmware
            ) {
              getFirmwareVersionCompletedCB(return_code, firmware);
            });
            //获取设备状态信息返回的信号
            thermalPrinterObject.sig_getted_device_status.connect(function (
              return_code,
              status
            ) {
              getDeviceStatusCompletedCB(return_code, status);
            });
            //获取纸张状态信息返回的信号
            thermalPrinterObject.sig_getted_paper_status.connect(function (
              return_code,
              status
            ) {
              getPaperStatusCompletedCB(return_code, status);
            });
            //走纸返回的信号
            thermalPrinterObject.sig_short_distance.connect(function (
              return_code
            ) {
              shortDistanceCompletedCB(return_code);
            });
            //设置行间距返回的信号
            thermalPrinterObject.sig_set_line_space.connect(function (
              return_code
            ) {
              setLineSpaceCompletedCB(return_code);
            });
            //设置字符间距返回的信号
            thermalPrinterObject.sig_set_characters_space.connect(function (
              return_code
            ) {
              setCharactersSpaceCompletedCB(return_code);
            });
            //设置左边距返回的信号
            thermalPrinterObject.sig_set_left_margin.connect(function (
              return_code
            ) {
              setLeftMarginCompletedCB(return_code);
            });
            //设置文本放大接口返回的信号
            thermalPrinterObject.sig_set_text_size.connect(function (
              return_code
            ) {
              setTextSizeCompletedCB(return_code);
            });
            //设置字符对齐方式返回的信号
            thermalPrinterObject.sig_set_alignment.connect(function (
              return_code
            ) {
              setAlignmentCompletedCB(return_code);
            });
            //设置字体旋转接口返回的信号
            thermalPrinterObject.sig_set_rotate.connect(function (return_code) {
              setRotateCompletedCB(return_code);
            });
            //设置字体加粗接口返回的信号
            thermalPrinterObject.sig_set_bold.connect(function (return_code) {
              setBoldCompletedCB(return_code);
            });
            //设置反色模式接口返回的信号
            thermalPrinterObject.sig_set_inverse_color_mode.connect(function (
              return_code
            ) {
              setInverseColorModeCompletedCB(return_code);
            });
            //设置字体斜体接口返回的信号
            thermalPrinterObject.sig_set_italic.connect(function (return_code) {
              setItalicCompletedCB(return_code);
            });
            //设置下划线接口返回的信号
            thermalPrinterObject.sig_set_underline.connect(function (
              return_code
            ) {
              setUnderlineCompletedCB(return_code);
            });
            //切纸接口返回的信号
            thermalPrinterObject.sig_cut_paper.connect(function (return_code) {
              cutPaperCompletedCB(return_code);
            });
            //打印ASCII字符串接口返回的信号
            thermalPrinterObject.sig_printed_ascii_string.connect(function (
              return_code
            ) {
              printAsciiStringCompletedCB(return_code);
            });
            //打印中文字符串接口返回的信号
            thermalPrinterObject.sig_printed_chinese_string.connect(function (
              return_code
            ) {
              printChineseStringCompletedCB(return_code);
            });
            //打印条形码接口返回的信号
            thermalPrinterObject.sig_printed_barcode.connect(function (
              return_code
            ) {
              printBarcodeCompletedCB(return_code);
            });
            //打印QR二维码接口返回的信号
            thermalPrinterObject.sig_printed_qrcode.connect(function (
              return_code
            ) {
              printQrcodeCompletedCB(return_code);
            });
            //打印位图接口返回的信号
            thermalPrinterObject.sig_printed_bitmap.connect(function (
              return_code
            ) {
              printBitmapCompletedCB(return_code);
            });
            //设置 nv 位图接口返回的信号
            thermalPrinterObject.sig_set_nv_bitmap.connect(function (
              return_code
            ) {
              setNvBitmapCompletedCB(return_code);
            });
            //打印nv位图接口返回的信号
            thermalPrinterObject.sig_printed_nv_bitmap.connect(function (
              return_code
            ) {
              printNvBitmapCompletedCB(return_code);
            });
            if (typeof thermalPrinterConnectedCB == "function") {
              thermalPrinterConnectedCB();
            }
          });
        };
        that.socket.onclose = function () {
          console.log("serial board websocket disconnected.");
        };
      },
      /**
       *  删除websocket重复连接
       */
      removes: function () {
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
      },

      /**
       * 打开设备
       * @param {void} callback 回调函数
       */
      open: function (callback) {
        openCompletedCB = callback;
        thermalPrinterObject.open(function (return_code) {
          if (0 != return_code) {
            openCompletedCB(return_code);
          }
        });
      },
      /**
       * 关闭设备
       * @param {void} callback 回调函数
       */
      close: function (callback) {
        closeCompletedCB = callback;
        thermalPrinterObject.close(function (return_code) {
          if (0 != return_code) {
            closeCompletedCB(return_code);
          }
        });
      },
      /**
       * 重置设备
       * @param {void} callback 回调函数
       */
      reset: function (callback) {
        resetCompletedCB = callback;
        thermalPrinterObject.reset(function (return_code) {
          if (0 != return_code) {
            resetCompletedCB(return_code);
          }
        });
      },
      /**
       * 获取设备固件版本号
       * @param {void} callback 回调函数
       */
      getFirmwareVersion: function (callback) {
        getFirmwareVersionCompletedCB = callback;
        thermalPrinterObject.get_firmware_version(function (return_code) {
          if (0 != return_code) {
            getFirmwareVersionCompletedCB(return_code);
          }
        });
      },
      /**
       * 设备状态
       * @param {void} callback 回调函数
       */
      getDeviceStatus: function (callback) {
        getDeviceStatusCompletedCB = callback;
        thermalPrinterObject.get_device_status(function (return_code) {
          if (0 != return_code) {
            getDeviceStatusCompletedCB(return_code);
          }
        });
      },
      /**
       * 获取纸张状态
       * @param {void} callback 回调函数
       */
      getPaperStatus: function (callback) {
        getPaperStatusCompletedCB = callback;
        thermalPrinterObject.get_paper_status(function (return_code) {
          if (0 != return_code) {
            getPaperStatusCompletedCB(return_code);
          }
        });
      },
      /**
       * 走纸
       * @param {int} space 走纸行数
       * @param {void} callback 回调函数
       */
      shortDistance: function (space, callback) {
        shortDistanceCompletedCB = callback;
        thermalPrinterObject.short_distance(space, function (return_code) {
          if (0 != return_code) {
            shortDistanceCompletedCB(return_code);
          }
        });
      },
      /**
       * 设置行间距
       * @param {int} space 行间距
       * @param {void} callback 回调函数
       */
      setLineSpace: function (space, callback) {
        setLineSpaceCompletedCB = callback;
        thermalPrinterObject.set_line_space(space, function (return_code) {
          if (0 != return_code) {
            setLineSpaceCompletedCB(return_code);
          }
        });
      },
      /**
       * 设置字符间距
       * @param {int} space 字符间距
       * @param {void} callback 回调函数
       */
      setCharactersSpace: function (space, callback) {
        setCharactersSpaceCompletedCB = callback;
        thermalPrinterObject.set_characters_space(
          space,
          function (return_code) {
            if (0 != return_code) {
              setCharactersSpaceCompletedCB(return_code);
            }
          }
        );
      },
      /**
       * 设置左边距
       * @param {int} space 左边距
       * @param {void} callback 回调函数
       */
      setLeftMargin: function (space, callback) {
        setLeftMarginCompletedCB = callback;
        thermalPrinterObject.set_left_margin(space, function (return_code) {
          if (0 != return_code) {
            setLeftMarginCompletedCB(return_code);
          }
        });
      },
      /**
       * 设置文本放大
       * @param {int} width 放大宽度倍数
       * @param {int} height 放大高度倍数
       * @param {void} callback 回调函数
       */
      setTextSize: function (width, height, callback) {
        setTextSizeCompletedCB = callback;
        thermalPrinterObject.set_text_size(
          width,
          height,
          function (return_code) {
            if (0 != return_code) {
              setTextSizeCompletedCB(return_code);
            }
          }
        );
      },
      /**
       * 设置字体对齐方式
       * @param {int} alignment (0：左对齐 1：居中 2：右对齐)
       * @param {void} callback 回调函数
       */
      setAlignment: function (alignment, callback) {
        setAlignmentCompletedCB = callback;
        thermalPrinterObject.set_alignment(alignment, function (return_code) {
          if (0 != return_code) {
            setAlignmentCompletedCB(return_code);
          }
        });
      },
      /**
       * 设置字体旋转
       * @param {int} rotate (0：取消旋转 1：顺时针旋转90° 2：顺时针旋转180° 3：顺时针旋转270°)
       * @param {void} callback 回调函数
       */
      setRotate: function (rotate, callback) {
        setRotateCompletedCB = callback;
        thermalPrinterObject.set_rotate(rotate, function (return_code) {
          if (0 != return_code) {
            setRotateCompletedCB(return_code);
          }
        });
      },
      /**
       * 设置字体加粗
       * @param {bool} bold (true：设置字体加粗 false：取消字体加粗)
       * @param {void} callback 回调函数
       */
      setBold: function (bold, callback) {
        setBoldCompletedCB = callback;
        thermalPrinterObject.set_bold(bold, function (return_code) {
          if (0 != return_code) {
            setBoldCompletedCB(return_code);
          }
        });
      },
      /**
       * 设置反色模式
       * @param {bool} mode (true：黑底白字 false：白底黑字)
       * @param {void} callback 回调函数
       */
      setInverseColorMode: function (mode, callback) {
        setInverseColorModeCompletedCB = callback;
        thermalPrinterObject.set_inverse_color_mode(
          mode,
          function (return_code) {
            if (0 != return_code) {
              setInverseColorModeCompletedCB(return_code);
            }
          }
        );
      },
      /**
       * 设置字体斜体
       * @param {bool} italic (true：设置字体斜体 false：取消字体斜体)
       * @param {void} callback 回调函数
       */
      setItalic: function (italic, callback) {
        setItalicCompletedCB = callback;
        thermalPrinterObject.set_italic(italic, function (return_code) {
          if (0 != return_code) {
            setItalicCompletedCB(return_code);
          }
        });
      },
      /**
       * 设置下划线
       * @param {bool} underline (true：设置下划线 false：取消下划线)
       * @param {void} callback 回调函数
       */
      setUnderline: function (underline, callback) {
        setUnderlineCompletedCB = callback;
        thermalPrinterObject.set_underline(underline, function (return_code) {
          if (0 != return_code) {
            setUnderlineCompletedCB(return_code);
          }
        });
      },
      /**
       * 切纸
       * @param {void} callback 回调函数
       */
      cutPaper: function (callback) {
        cutPaperCompletedCB = callback;
        thermalPrinterObject.cut_paper(function (return_code) {
          if (0 != return_code) {
            cutPaperCompletedCB(return_code);
          }
        });
      },
      /**
       * 打印ASCII字符
       * @param {string} asciiString (打印的字符串内容,最大长度1024字节)
       * @param {void} callback 回调函数
       */
      printAsciiString: function (asciiString, callback) {
        printAsciiStringCompletedCB = callback;
        thermalPrinterObject.print_ascii_string(
          asciiString,
          function (return_code) {
            if (0 != return_code) {
              printAsciiStringCompletedCB(return_code);
            }
          }
        );
      },
      /**
       * 打印中文字符
       * @param {string} chineseString(打印的字符串内容，格式UTF-8,最大长度1024字节)
       * @param {void} callback 回调函数
       */
      printChineseString: function (chineseString, callback) {
        printChineseStringCompletedCB = callback;
        thermalPrinterObject.print_chinese_string(
          chineseString,
          function (return_code) {
            if (0 != return_code) {
              printChineseStringCompletedCB(return_code);
            }
          }
        );
      },
      /**
       * 打印条形码
       * @param {string} data (条形码内容)
       * @param {int} type (条形码类型)
       * @param {int} width (条形码宽度)
       * @param {int} height (条形码高度)
       * @param {void} callback 回调函数
       */
      printBarcode: function (data, type, width, height, callback) {
        printBarcodeCompletedCB = callback;
        thermalPrinterObject.print_barcode(
          data,
          type,
          width,
          height,
          function (return_code) {
            if (0 != return_code) {
              printBarcodeCompletedCB(return_code);
            }
          }
        );
      },
      /**
       * 打印QR码
       * @param {string} data (QR码内容)
       * @param {int} size (QR码大小,取值范围1-8)
       * @param {void} callback 回调函数
       */
      printQrcode: function (data, size, callback) {
        printQrcodeCompletedCB = callback;
        thermalPrinterObject.print_qrcode(data, size, function (return_code) {
          if (0 != return_code) {
            printQrcodeCompletedCB(return_code);
          }
        });
      },
      /**
       * 打印位图
       * @param {string} path (文件绝对路径，仅支持图像深度为1bit的bmp图片)
       * @param {void} callback 回调函数
       */
      printBitmap: function (path, callback) {
        printBitmapCompletedCB = callback;
        thermalPrinterObject.print_bitmap(path, function (return_code) {
          if (0 != return_code) {
            printBitmapCompletedCB(return_code);
          }
        });
      },
      /**
       * 设置NV位图
       * @param {int} count  (NV位图文件的数量，要和path参数的文件路径数量一致)
       * @param {string} path  (NV位图文件的绝对路径，以“;”分割；仅支持图像深度为1bit的bmp图片；单个文件最大支持64KB，所有文件合计最大支持192KB；
       *               如： "/tmp/1.bmp;/tmp/2.bmp;/tmp/2.bmp")
       * @param {void} callback 回调函数
       */
      setNvBitmap: function (count, path, callback) {
        setNvBitmapCompletedCB = callback;
        thermalPrinterObject.set_nv_bitmap(count, path, function (return_code) {
          if (0 != return_code) {
            setNvBitmapCompletedCB(return_code);
          }
        });
      },
      /**
       * 打印NV位图
       * @param {int} index  (位图索引，从1开始，和set_nv_bitmap设置的顺序一致，大于set_nv_bitmap设置的数量将不会打印)
       * @param {int} bitmap_size  (位图大小，0：正常 1：倍宽 2：倍高 3：倍宽倍高)
       * @param {void} callback 回调函数
       */
      printNvBitmap: function (index, bitmap_size, callback) {
        printNvBitmapCompletedCB = callback;
        thermalPrinterObject.print_nv_bitmap(
          index,
          bitmap_size,
          function (return_code) {
            if (0 != return_code) {
              printNvBitmapCompletedCB(return_code);
            }
          }
        );
      },
    },
  }),
    //读卡类
    (CardReader = {
      //二代证阅读器
      IDCardReader: {
        //连接身份证读卡器设备接口的回调函数
        idcardReaderConnectedCB: function () {},
        //打开设备接口的回调函数
        openCompletedCB: function () {},
        //关闭设备接口的回调函数
        closeCompletedCB: function () {},
        //读取卡片信息接口的回调函数
        readCardInformationCompletedCB: function () {},
        //启动卡片信息监听接口的回调函数
        startCardInformationListenerCompletedCB: function () {},
        //停止卡片信息监听接口的回调函数
        stopCardInformationListenerCompletedCB: function () {},
        socket: null,
        /**
         * WebSocket通讯连接身份证读卡器设备
         * @param callback (类型：void,说明：回调函数)
         */
        connected: function (callback) {
          idcardReaderConnectedCB = callback;
          var that = this;
          if (this.socket != null) {
            if (0 != this.socket.readyState) {
              this.socket.close();
            }
          }
          that.socket = new WebSocket("ws://localhost:8083");
          that.socket.onopen = function () {
            new QWebChannel(that.socket, function (channel) {
              //获取身份证读卡器对象
              idcardReaderObject = channel.objects.idCardReaderSS628100X;
              //打开设备返回的信号
              idcardReaderObject.sig_opened.connect(function (return_code) {
                openCompletedCB(return_code);
              });
              //关闭设备返回的信号
              idcardReaderObject.sig_closed.connect(function (return_code) {
                closeCompletedCB(return_code);
              });
              //调用单次读取卡片信息接口返回的信号
              idcardReaderObject.sig_read_card_information.connect(function (
                return_code
              ) {
                readCardInformationCompletedCB(return_code);
              });
              //上报单次二代证信息返回的信号
              idcardReaderObject.sig_read_id_card_information.connect(function (
                return_code,
                info
              ) {
                readCardInformationCompletedCB(return_code, info);
              });
              //启动卡片信息监听接口返回的信号
              idcardReaderObject.sig_started_card_information_listener.connect(
                function (return_code) {
                  startCardInformationListenerCompletedCB(return_code);
                }
              );
              //上报多次二代证信息返回的信号
              idcardReaderObject.sig_getted_id_card_information.connect(
                function (return_code, info) {
                  startCardInformationListenerCompletedCB(return_code, info);
                }
              );
              //停止卡片信息监听接口返回的信号
              idcardReaderObject.sig_stopped_card_information_listener.connect(
                function (return_code) {
                  stoppedCardInformationListenerCompletedCB(return_code);
                }
              );

              if (typeof idcardReaderConnectedCB == "function") {
                idcardReaderConnectedCB();
              }
            });
          };
          that.socket.onclose = function () {
            console.log("serial board websocket disconnected.");
          };
        },
        /**
         *  删除websocket重复连接
         */
        removes: function () {
          if (this.socket != null) {
            if (0 != this.socket.readyState) {
              this.socket.close();
            }
          }
        },
        /**
         * 打开设备
         * @param {void} callback 回调函数
         */
        open: function (callback) {
          openCompletedCB = callback;
          idcardReaderObject.open(function (return_code) {
            if (0 != return_code) {
              openCompletedCB(return_code);
            }
          });
        },
        /**
         * 关闭设备
         * @param {void} callback 回调函数
         */
        close: function (callback) {
          closeCompletedCB = callback;
          idcardReaderObject.close(function (return_code) {
            if (0 != return_code) {
              closeCompletedCB(return_code);
            }
          });
        },
        /**
         * 读取卡片信息
         * @param {void} callback 回调函数
         */
        readCardInformation: function (callback) {
          readCardInformationCompletedCB = callback;
          idcardReaderObject.read_card_information(function (return_code) {
            if (0 != return_code) {
              readCardInformationCompletedCB(return_code);
            }
          });
        },
        /**
         * 启动卡片信息监听
         * @param {void} callback 回调函数
         */
        startCardInformationListener: function (callback) {
          startCardInformationListenerCompletedCB = callback;
          idcardReaderObject.start_card_information_listener(function (
            return_code
          ) {
            if (0 != return_code) {
              startCardInformationListenerCompletedCB(return_code);
            }
          });
        },
        /**
         * 停止卡片信息监听
         * @param {void} callback 回调函数
         */
        stoppedCardInformationListener: function (callback) {
          stoppedCardInformationListenerCompletedCB = callback;
          idcardReaderObject.stop_card_information_listener(function (
            return_code
          ) {
            if (0 != return_code) {
              stoppedCardInformationListenerCompletedCB(return_code);
            }
          });
        },
      },
      //RFID柜读卡器
      RfidCardReader: {
        socket: null,
        //连接RFID读卡器接口的回调函数
        rfidCardReaderConnectedCB: function () {},
        //打开设备接口的回调函数
        openCompletedCB: function () {},
        //关闭设备接口的回调函数
        closeCompletedCB: function () {},
        //重置设备接口的回调函数
        resetCompletedCB: function () {},
        //获取固件版本信息接口的回调函数
        getFirmwareVersionCompletedCB: function () {},
        //启动卡片信息监听接口的回调函数
        startCardInformationListenerCompletedCB: function () {},
        //停止卡片信息监听接口的回调函数
        stopCardInformationListenerCompletedCB: function () {},
        /**
         * WebSocket通讯连接RFID读卡器设备
         * @param callback (类型：void,说明：回调函数)
         */
        connected: function (callback) {
          rfidCardReaderConnectedCB = callback;
          var that = this;
          if (this.socket != null) {
            if (0 != this.socket.readyState) {
              this.socket.close();
            }
          }
          that.socket = new WebSocket("ws://localhost:8083");
          that.socket.onopen = function () {
            new QWebChannel(that.socket, function (channel) {
              //获取RFID读卡器对象
              rfidCardReaderObject = channel.objects.rfidCardReaderR2000;
              //打开设备返回的信号，返回码：return_code
              rfidCardReaderObject.sig_opened.connect(function (return_code) {
                openCompletedCB(return_code);
              });
              //关闭设备返回的信号，返回码：return_code
              rfidCardReaderObject.sig_closed.connect(function (return_code) {
                closeCompletedCB(return_code);
              });
              //重置设备返回的信号，返回码：return_code
              rfidCardReaderObject.sig_reset.connect(function (return_code) {
                resetCompletedCB(return_code);
              });
              //获取固件版本信息返回的信号，返回码：return_code，firmware:版本信息
              rfidCardReaderObject.sig_getted_firmware_version.connect(
                function (return_code, firmware) {
                  getFirmwareVersionCompletedCB(return_code, firmware);
                }
              );
              //启动卡片信息监听调用返回信号，返回码：return_code
              rfidCardReaderObject.sig_started_card_information_listener.connect(
                function (return_code) {
                  startCardInformationListenerCompletedCB(return_code);
                }
              );
              //卡信息上报信号，返回码：return_code，ant_id:数值，天线编号；card_num:字符串，卡号
              rfidCardReaderObject.sig_getted_card_information.connect(
                function (return_code, ant_id, card_num) {
                  startCardInformationListenerCompletedCB(
                    return_code,
                    ant_id,
                    card_num
                  );
                }
              );
              //停止卡片状态监听调用返回信号字符串，返回码：return_code
              rfidCardReaderObject.sig_stopped_card_information_listener.connect(
                function (return_code) {
                  stopCardInformationListenerCompletedCB(return_code);
                }
              );
              if (typeof rfidCardReaderConnectedCB == "function") {
                rfidCardReaderConnectedCB();
              }
            });
          };
          that.socket.onclose = function () {
            console.log("serial board websocket disconnected.");
          };
        },
        /**
         *  删除websocket重复连接
         */
        removes: function () {
          if (this.socket != null) {
            if (0 != this.socket.readyState) {
              this.socket.close();
            }
          }
        },
        /**
         * 打开设备
         * @param {void} callback 回调函数
         */
        open: function (callback) {
          openCompletedCB = callback;
          rfidCardReaderObject.open(function (return_code) {
            if (0 != return_code) {
              openCompletedCB(return_code);
            }
          });
        },
        /**
         * 关闭设备
         * @param {void} callback 回调函数
         */
        close: function (callback) {
          closeCompletedCB = callback;
          rfidCardReaderObject.close(function (return_code) {
            if (0 != return_code) {
              closeCompletedCB(return_code);
            }
          });
        },
        /**
         * 重置设备
         * @param {void} callback 回调函数
         */
        reset: function (callback) {
          resetCompletedCB = callback;
          rfidCardReaderObject.reset(function (return_code) {
            if (0 != return_code) {
              resetCompletedCB(return_code);
            }
          });
        },
        /**
         * 获取固件版本号
         * @param {void} callback 回调函数
         */
        getFirmwareVersion: function (callback) {
          getFirmwareVersionCompletedCB = callback;
          rfidCardReaderObject.get_firmware_version(function (return_code) {
            if (0 != return_code) {
              getFirmwareVersionCompletedCB(return_code);
            }
          });
        },
        /**
         * 启动卡片信息监听
         * @param {void} callback 回调函数
         */
        startCardInformationListener: function (callback) {
          startCardInformationListenerCompletedCB = callback;
          rfidCardReaderObject.start_card_information_listener(function (
            return_code
          ) {
            if (0 != return_code) {
              startCardInformationListenerCompletedCB(return_code);
            }
          });
        },
        /**
         * 停止卡片信息监听
         * @param {void} callback 回调函数
         */
        stopCardInformationListener: function (callback) {
          stopCardInformationListenerCompletedCB = callback;
          rfidCardReaderObject.stop_card_information_listener(function (
            return_code
          ) {
            if (0 != return_code) {
              stopCardInformationListenerCompletedCB(return_code);
            }
          });
        },
      },
    }),
    //拍摄类
    (Camera = {
      //高拍仪
      HighSpeedScanner: {
        //连接高拍仪设备接口的回调函数
        highSpeedScannerConnectedCB: function () {},
        //打开设备接口的回调函数
        openedPreviewCompletedCB: function () {},
        //关闭设备接口的回调函数
        closedPreviewCompletedCB: function () {},
        //拍照接口的回调函数
        tookPictureCompletedCB: function () {},
        socket: null,
        /**
         * WebSocket通讯连接高拍仪设备
         * @param callback (类型：void,说明：回调函数)
         */
        connected: function (callback) {
          highSpeedScannerConnectedCB = callback;
          var that = this;
          that.removesWebsocket();
          that.socket = new WebSocket("ws://localhost:8083");
          that.socket.onopen = function () {
            new QWebChannel(that.socket, function (channel) {
              //获取高拍仪设备对象
              highSpeedScannerObject = channel.objects.HighSpeedScannerLHT650CF;
              //打开高拍仪预览返回的信号
              highSpeedScannerObject.sig_opened_preview.connect(function (
                return_code
              ) {
                openedPreviewCompletedCB(return_code);
              });
              //关闭高拍仪预览返回的信号
              highSpeedScannerObject.sig_closed_preview.connect(function (
                return_code
              ) {
                closedPreviewCompletedCB(return_code);
              });
              //高拍仪拍照返回的信号
              highSpeedScannerObject.sig_took_picture.connect(function (
                return_code,
                imageData
              ) {
                tookPictureCompletedCB(return_code, imageData);
              });

              if (typeof highSpeedScannerConnectedCB == "function") {
                highSpeedScannerConnectedCB();
              }
            });
          };
          that.socket.onclose = function () {
            console.log("serial board websocket disconnected.");
          };
        },
        /**
         *  删除websocket重复连接
         */
        removesWebsocket: function () {
          if (this.socket != null) {
            if (0 != this.socket.readyState) {
              this.socket.close();
            }
          }
        },
        /**
         * 打开高拍仪预览
         * @param {int} winX (预览窗口在屏幕显示的起始坐标 x，单位像素,取值范围0-1920)
         * @param {int} winY (预览窗口在屏幕显示的起始坐标 y，单位像素,取值范围0-1080)
         * @param {int} winW (预览窗口的宽度，单位像素,取值范围1-1920)
         * @param {int} winH (预览窗口的高度，单位像素,取值范围1-1080)
         * @param {void} callback 回调函数
         */
        openPreview: function (winX, winY, winW, winH, callback) {
          openedPreviewCompletedCB = callback;
          highSpeedScannerObject.open_preview(
            winX,
            winY,
            winW,
            winH,
            function (return_code) {
              if (0 != return_code) {
                openedPreviewCompletedCB(return_code);
              }
            }
          );
        },
        /**
         * 关闭高拍仪预览
         * @param {void} callback 回调函数
         */
        closePreview: function (callback) {
          closedPreviewCompletedCB = callback;
          highSpeedScannerObject.close_preview(function (return_code) {
            if (0 != return_code) {
              closedPreviewCompletedCB(return_code);
            }
          });
        },
        /**
         * 高拍仪拍照
         * @param {int} image_w (拍照保存的宽度分辨率，取值范围1-1920)
         * @param {int} image_h (拍照保存的高度分辨率，取值范围1-1080)
         * @param {int} format (图片格式；0，bmp；1，jpeg；2，png)
         * @param {void} callback 回调函数
         */
        takePicture: function (image_w, image_h, format, callback) {
          tookPictureCompletedCB = callback;
          highSpeedScannerObject.take_picture(
            image_w,
            image_h,
            format,
            function (return_code) {
              if (0 != return_code) {
                tookPictureCompletedCB(return_code);
              }
            }
          );
        },
      },
    }),
    //手写板类
    (HandleWriter = {
      //签名板设备
      VirtualHandleWriter: {
        socket: null,
        virtualHandleWriterConnectedCB: function () {},
        openedWindowCompletedCB: function () {},
        closeWindowCompletedCB: function () {},
        cancelSignatureCompletedCB: function () {},
        connected: function (callback) {
          virtualHandleWriterConnectedCB = callback;
          var that = this;
          if (this.socket != null) {
            if (0 != this.socket.readyState) {
              this.socket.close();
            }
          }
          that.socket = new WebSocket("ws://localhost:8083");
          that.socket.onopen = function () {
            new QWebChannel(that.socket, function (channel) {
              virtualHandleWriterObject =
                channel.objects.DerivedClassVirtualHandleWriter;
              virtualHandleWriterObject.sig_opened_window.connect(function (
                return_code
              ) {
                openedWindowCompletedCB(return_code);
              });
              virtualHandleWriterObject.sig_closed_window.connect(function (
                return_code,
                image_base64,
                image_file,
                track_data,
                track_file
              ) {
                closeWindowCompletedCB(
                  return_code,
                  image_base64,
                  image_file,
                  track_data,
                  track_file
                );
              });
              virtualHandleWriterObject.sig_canceled_signature.connect(
                function (return_code) {
                  cancelSignatureCompletedCB(return_code);
                }
              );

              if (typeof virtualHandleWriterConnectedCB == "function") {
                virtualHandleWriterConnectedCB();
              }
            });
          };
          that.socket.onclose = function () {
            console.log("serial board websocket disconnected.");
          };
        },
        removes: function () {
          if (this.socket != null) {
            if (0 != this.socket.readyState) {
              this.socket.close();
            }
          }
        },
        openWindow: function (winX, winY, winW, winH, callback) {
          openedWindowCompletedCB = callback;
          virtualHandleWriterObject.open_window(
            winX,
            winY,
            winW,
            winH,
            function (return_code) {
              if (0 != return_code) {
                openedWindowCompletedCB(return_code);
              }
            }
          );
        },
        confirSign: function (format, image_depth, callback) {
          closeWindowCompletedCB = callback;
          virtualHandleWriterObject.close_window(
            format,
            image_depth,
            function (return_code) {
              if (0 != return_code) {
                closeWindowCompletedCB(return_code);
              }
            }
          );
        },
        cancelSignature: function (callback) {
          cancelSignatureCompletedCB = callback;
          virtualHandleWriterObject.cancel_signature(function (return_code) {
            if (0 != return_code) {
              cancelSignatureCompletedCB(return_code);
            }
          });
        },
      },
    }),
    //电源类
    (PowerSupply = {
      //UPS设备
      UnintreturnuptiblePowerSupply: {
        socket: null,
        //连接UPS设备接口的回调函数
        unintreturnuptiblePowerSupplyConnectedCB: function () {},
        //打开设备接口的回调函数
        openCompletedCB: function () {},
        //关闭设备接口的回调函数
        closeCompletedCB: function () {},
        //获取工作状态接口的回调函数
        getWorkStatusCompletedCB: function () {},
        //获取固件版本接口的回调函数
        getFirmwareVersionCompletedCB: function () {},
        //停止蜂鸣器警报接口的回调函数
        stopBuzzerAlarmCompletedCB: function () {},
        //电池放电测试接口的回调函数
        batteryDischargeTestCompletedCB: function () {},
        //倒计时关机接口的回调函数
        countdownShutdownCompletedCB: function () {},
        //倒计时关机后延时开机接口的回调函数
        countdownShutdownAndDelayBootCompletedCB: function () {},
        //取消关机倒计时接口的回调函数
        clearCountdownSettingsCompletedCB: function () {},
        /**
         * WebSocket通讯连接二维码设备
         * @param callback (类型：void,说明：回调函数)
         */
        connected: function (callback) {
          UnintreturnuptiblePowerSupplyConnectedCB = callback;
          var that = this;
          if (this.socket != null) {
            if (0 != this.socket.readyState) {
              this.socket.close();
            }
          }
          that.socket = new WebSocket("ws://localhost:8083");
          that.socket.onopen = function () {
            new QWebChannel(that.socket, function (channel) {
              //获取UPS设备对象
              unintreturnuptiblePowerSupplyObject =
                channel.objects.uninterruptedPowerSupplyEA300;
              //打开设备接口返回的信号
              unintreturnuptiblePowerSupplyObject.sig_opened.connect(function (
                return_code
              ) {
                openCompletedCB(return_code);
              });
              //关闭设备接口返回的信号
              unintreturnuptiblePowerSupplyObject.sig_closed.connect(function (
                return_code
              ) {
                closeCompletedCB(return_code);
              });
              //获取固件版本接口返回的信号
              unintreturnuptiblePowerSupplyObject.sig_getted_firmware_version.connect(
                function (return_code, firmware) {
                  getFirmwareVersionCompletedCB(return_code, firmware);
                }
              );
              //获取工作状态接口返回的信号
              unintreturnuptiblePowerSupplyObject.sig_getted_work_status.connect(
                function (return_code, work_status) {
                  getWorkStatusCompletedCB(return_code, work_status);
                }
              );
              //停止蜂鸣器警报接口返回的信号
              unintreturnuptiblePowerSupplyObject.sig_stopped_buzzer_alarm.connect(
                function (return_code) {
                  stopBuzzerAlarmCompletedCB(return_code);
                }
              );
              //电池放电测试接口返回的信号
              unintreturnuptiblePowerSupplyObject.sig_battery_discharge_test.connect(
                function (return_code) {
                  batteryDischargeTestCompletedCB(return_code);
                }
              );
              //倒计时关机接口返回的信号
              unintreturnuptiblePowerSupplyObject.sig_countdown_shutdown.connect(
                function (return_code) {
                  countdownShutdownCompletedCB(return_code);
                }
              );
              //倒计时关机后延时开机接口返回的信号
              unintreturnuptiblePowerSupplyObject.sig_countdown_shutdown_and_delay_boot.connect(
                function (return_code) {
                  countdownShutdownAndDelayBootCompletedCB(return_code);
                }
              );
              //取消关机倒计时接口返回的信号
              unintreturnuptiblePowerSupplyObject.sig_canceled_countdown_shutdown.connect(
                function (return_code) {
                  clearCountdownSettingsCompletedCB(return_code);
                }
              );

              if (
                typeof unintreturnuptiblePowerSupplyConnectedCB == "function"
              ) {
                unintreturnuptiblePowerSupplyConnectedCB();
              }
            });
          };
          that.socket.onclose = function () {
            console.log("serial board websocket disconnected.");
          };
        },
        /**
         * 打开设备
         * @param {void} callback 回调函数
         */
        open: function (callback) {
          openCompletedCB = callback;
          unintreturnuptiblePowerSupplyObject.open(function (return_code) {
            if (0 != return_code) {
              openCompletedCB(return_code);
            }
          });
        },
        /**
         * 关闭设备
         * @param {void} callback 回调函数
         */
        close: function (callback) {
          closeCompletedCB = callback;
          unintreturnuptiblePowerSupplyObject.close(function (return_code) {
            if (0 != return_code) {
              closeCompletedCB(return_code);
            }
          });
        },
        /**
         * 获取工作状态
         * @param {void} callback 回调函数
         */
        getWorkStatus: function (callback) {
          getWorkStatusCompletedCB = callback;
          unintreturnuptiblePowerSupplyObject.get_work_status(function (
            return_code
          ) {
            if (0 != return_code) {
              getWorkStatusCompletedCB(return_code);
            }
          });
        },
        /**
         * 获取固件版本
         * @param {void} callback 回调函数
         */
        getFirmwareVersion: function (callback) {
          getFirmwareVersionCompletedCB = callback;
          unintreturnuptiblePowerSupplyObject.get_firmware_version(function (
            return_code
          ) {
            if (0 != return_code) {
              getFirmwareVersionCompletedCB(return_code);
            }
          });
        },
        /**
         * 停止蜂鸣器警报
         * @param {void} callback 回调函数
         */
        stopBuzzerAlarm: function (callback) {
          stopBuzzerAlarmCompletedCB = callback;
          unintreturnuptiblePowerSupplyObject.stop_buzzer_alarm(function (
            return_code
          ) {
            if (0 != return_code) {
              stopBuzzerAlarmCompletedCB(return_code);
            }
          });
        },
        /**
         * 电池放电测试
         * @param {void} callback 回调函数
         */
        batteryDischargeTest: function (callback) {
          batteryDischargeTestCompletedCB = callback;
          unintreturnuptiblePowerSupplyObject.battery_discharge_test(function (
            return_code
          ) {
            if (0 != return_code) {
              batteryDischargeTestCompletedCB(return_code);
            }
          });
        },
        /**
         * 倒计时关机
         * @param {int} countdown (倒计时关机的时间，单位：分钟,取值范围参考附录的《UPS参数取值说明表格》)
         * @param {void} callback 回调函数
         */
        countdownShutdown: function (countdown, callback) {
          countdownShutdownCompletedCB = callback;
          unintreturnuptiblePowerSupplyObject.countdown_shutdown(
            countdown,
            function (return_code) {
              if (0 != return_code) {
                countdownShutdownCompletedCB(return_code);
              }
            }
          );
        },
        /**
         * 倒计时关机后延时开机
         * @param {int} countdown  (倒计时关机的时间，单位：分钟,取值范围参考附录的《UPS参数取值说明表格》)
         * @param {int} delay (倒计时关机后延时开机的时间，单位：分钟,取值范围参考附录的《UPS参数取值说明表格》)
         * @param {void} callback 回调函数
         */
        countdownShutdownAndDelayBoot: function (countdown, delay, callback) {
          countdownShutdownAndDelayBootCompletedCB = callback;
          unintreturnuptiblePowerSupplyObject.countdown_shutdown_and_delay_boot(
            countdown,
            delay,
            function (return_code) {
              if (0 != return_code) {
                countdownShutdownAndDelayBootCompletedCB(return_code);
              }
            }
          );
        },
        /**
         * 取消关机倒计时
         * @param {void} callback 回调函数
         */
        clearCountdownSettings: function (callback) {
          clearCountdownSettingsCompletedCB = callback;
          unintreturnuptiblePowerSupplyObject.cancel_countdown_shutdown(
            function (return_code) {
              if (0 != return_code) {
                clearCountdownSettingsCompletedCB(return_code);
              }
            }
          );
        },
      },
    }),
    //控制板类
    (ExternBoard = {
      //串口板设备
      GPIOExternBoard: {
        //连接串口板设备接口的回调函数
        gPIOExternBoardConnectedCB: function () {},
        //打开设备接口的回调函数
        openCompletedCB: function () {},
        //关闭设备接口的回调函数
        closeCompletedCB: function () {},
        //重置设备接口的回调函数
        resetCompletedCB: function () {},
        //获取 gpio 状态接口的回调函数
        getGpioStatusCompletedCB: function () {},
        //设置gpio状态接口的回调函数
        setOutputGpioStatusCompletedCB: function () {},
        //启动输入gpio的状态监听接口的回调函数
        startInputGpioStatusListenerCompletedCB: function () {},
        //停止输入gpio的状态监听接口的回调函数
        stopInputGpioStatusListenerCompletedCB: function () {},
        socket: null,
        /**
         * WebSocket通讯连接二维码设备
         * @param callback (类型：void,说明：回调函数)
         */
        connected: function (callback) {
          gPIOExternBoardConnectedCB = callback;
          var that = this;
          that.removesWebsocket();
          that.socket = new WebSocket("ws://localhost:8083");
          that.socket.onopen = function () {
            new QWebChannel(that.socket, function (channel) {
              //获取串口板对象
              gPIOExternBoardObject = channel.objects.gpioExternBoardYS232C10;
              //打开设备接口返回的信号
              gPIOExternBoardObject.sig_opened.connect(function (return_code) {
                openCompletedCB(return_code);
              });
              //关闭设备接口返回的信号
              gPIOExternBoardObject.sig_closed.connect(function (return_code) {
                closeCompletedCB(return_code);
              });
              //重置设备接口返回的信号
              gPIOExternBoardObject.sig_reset.connect(function (return_code) {
                resetCompletedCB(return_code);
              });
              //获取gpio状态接口返回的信号
              gPIOExternBoardObject.sig_getted_gpio_status.connect(function (
                return_code,
                status
              ) {
                getGpioStatusCompletedCB(return_code, status);
              });
              //设置gpio状态接口返回的信号
              gPIOExternBoardObject.sig_set_output_gpio_status.connect(
                function (return_code) {
                  setOutputGpioStatusCompletedCB(return_code);
                }
              );
              //启动输入gpio的状态监听接口返回的信号
              gPIOExternBoardObject.sig_started_input_gpio_status_listener.connect(
                function (return_code) {
                  startInputGpioStatusListenerCompletedCB(return_code);
                }
              );
              //状态上报返回的信号
              gPIOExternBoardObject.sig_getted_input_gpio_status.connect(
                function (return_code, channel, status) {
                  startInputGpioStatusListenerCompletedCB(
                    return_code,
                    channel,
                    status
                  );
                }
              );
              //停止输入gpio的状态监听接口返回的信号
              gPIOExternBoardObject.sig_stopped_input_gpio_status_listener.connect(
                function (return_code) {
                  stopInputGpioStatusListenerCompletedCB(return_code);
                }
              );

              if (typeof gPIOExternBoardConnectedCB == "function") {
                gPIOExternBoardConnectedCB();
              }
            });
          };
          that.socket.onclose = function () {
            console.log("serial board websocket disconnected.");
          };
        },
        /**
         * 删除websocket重复连接
         */
        removesWebsocket: function () {
          if (this.socket != null) {
            if (0 != this.socket.readyState) {
              this.socket.close();
            }
          }
        },
        /**
         * 打开设备
         * @param {void} callback 回调函数
         */
        open: function (callback) {
          openCompletedCB = callback;
          gPIOExternBoardObject.open(function (return_code) {
            if (0 != return_code) {
              openCompletedCB(return_code);
            }
          });
        },
        /**
         * 关闭设备
         * @param {void} callback 回调函数
         */
        close: function (callback) {
          closeCompletedCB = callback;
          gPIOExternBoardObject.close(function (return_code) {
            if (0 != return_code) {
              closeCompletedCB(return_code);
            }
          });
        },
        /**
         * 重置设备
         * @param {void} callback 回调函数
         */
        reset: function (callback) {
          resetCompletedCB = callback;
          gPIOExternBoardObject.reset(function (return_code) {
            if (0 != return_code) {
              resetCompletedCB(return_code);
            }
          });
        },
        /**
         * 获取gpio状态
         * @param {int} channel (要查询的 gpio 口取值范围参考附录的《串口控制板参数取值说明表格》)
         * @param {void} callback 回调函数
         */
        getGpioStatus: function (channel, callback) {
          getGpioStatusCompletedCB = callback;
          gPIOExternBoardObject.get_gpio_status(
            channel,
            function (return_code) {
              if (0 != return_code) {
                getGpioStatusCompletedCB(return_code);
              }
            }
          );
        },
        /**
         * 设置gpio状态
         * @param {int} channel (要设置的 gpio 口,取值范围参考附录的《串口控制板参数取值说明表格》)
         * @param {int} status (设置gpio状态,取值范围参考附录的《串口控制板参数取值说明表格》)
         * @param {void} callback 回调函数
         */
        setOutputGpioStatus: function (channel, status, callback) {
          setOutputGpioStatusCompletedCB = callback;
          gPIOExternBoardObject.set_output_gpio_status(
            channel,
            status,
            function (return_code) {
              if (0 != return_code) {
                setOutputGpioStatusCompletedCB(return_code);
              }
            }
          );
        },
        /**
         * 启动输入gpio的状态监听
         * @param {int} channel (要监听的输入 gpio 口,取值范围参考附录的《串口控制板参数取值说明表格》)
         * @param {void} callback 回调函数
         */
        startInputGpioStatusListener: function (channel, callback) {
          startInputGpioStatusListenerCompletedCB = callback;
          gPIOExternBoardObject.start_input_gpio_status_listener(
            channel,
            function (return_code) {
              if (0 != return_code) {
                startInputGpioStatusListenerCompletedCB(return_code);
              }
            }
          );
        },
        /**
         * 停止输入gpio的状态监听
         * @param {int} channel (要停止监听的输入 gpio 口,取值范围参考附录的《串口控制板参数取值说明表格》)
         * @param {void} callback 回调函数
         */
        stopInputGpioStatusListener: function (channel, callback) {
          stopInputGpioStatusListenerCompletedCB = callback;
          gPIOExternBoardObject.stop_input_gpio_status_listener(
            channel,
            function (return_code) {
              if (0 != return_code) {
                stopInputGpioStatusListenerCompletedCB(return_code);
              }
            }
          );
        },
      },
      //锁控板
      LockExternBoard: {
        //连接锁控板设备接口的回调函数
        lockExternBoardConnectedCB: function () {},
        //打开设备接口的回调函数
        openCompletedCB: function () {},
        //关闭设备接口的回调函数
        closeCompletedCB: function () {},
        //重置设备接口的回调函数
        resetCompletedCB: function () {},
        //获取固件信息接口的回调函数
        getFirmwareInfoCompletedCB: function () {},
        //打开单个锁接口的回调函数
        openLockCompletedCB: function () {},
        //打开所有锁接口的回调函数
        openLockAllCompletedCB: function () {},
        //打开格灯接口的回调函数
        openLightCompletedCB: function () {},
        //关闭格灯接口的回调函数
        closeLightCompletedCB: function () {},
        //获取单个锁状态接口的回调函数
        getLockStatusCompletedCB: function () {},
        //获取所有锁状态接口的回调函数
        getAllLockStatusCompletedCB: function () {},
        socket: null,
        /**
         * WebSocket通讯连接锁控板设备
         * @param callback (类型：void,说明：回调函数)
         */
        connected: function (callback) {
          lockExternBoardConnectedCB = callback;
          var that = this;
          if (this.socket != null) {
            if (0 != this.socket.readyState) {
              this.socket.close();
            }
          }
          that.socket = new WebSocket("ws://localhost:8083");
          that.socket.onopen = function () {
            new QWebChannel(that.socket, function (channel) {
              //获取锁控板对象
              lockExternBoardObject = channel.objects.lockExternBoardHLC014;
              //打开设备返回的信号
              lockExternBoardObject.sig_opened.connect(function (return_code) {
                openCompletedCB(return_code);
              });
              //关闭设备返回的信号
              lockExternBoardObject.sig_closed.connect(function (return_code) {
                closeCompletedCB(return_code);
              });
              //重置设备返回的信号
              lockExternBoardObject.sig_reset.connect(function (return_code) {
                resetCompletedCB(return_code);
              });
              //获取固件信息返回的信号
              lockExternBoardObject.sig_getted_firmware_info.connect(function (
                return_code,
                firmware_info
              ) {
                getFirmwareInfoCompletedCB(return_code, firmware_info);
              });
              //打开单个锁返回的信号
              lockExternBoardObject.sig_opened_lock.connect(function (
                return_code
              ) {
                openLockCompletedCB(return_code);
              });
              //打开所有锁返回的信号
              lockExternBoardObject.sig_opened_lock_all.connect(function (
                return_code
              ) {
                openLockAllCompletedCB(return_code);
              });
              //打开格灯返回的信号
              lockExternBoardObject.sig_opened_light.connect(function (
                return_code
              ) {
                openLightCompletedCB(return_code);
              });
              //关闭格灯返回的信号
              lockExternBoardObject.sig_closed_light.connect(function (
                return_code
              ) {
                closeLightCompletedCB(return_code);
              });
              //获取单个锁状态返回的信号
              lockExternBoardObject.sig_getted_lock_status.connect(function (
                return_code,
                status
              ) {
                getLockStatusCompletedCB(return_code, status);
              });
              //获取所有锁状态返回的信号
              lockExternBoardObject.sig_getted_all_lock_status.connect(
                function (return_code, status) {
                  getAllLockStatusCompletedCB(return_code, status);
                }
              );

              if (typeof lockExternBoardConnectedCB == "function") {
                lockExternBoardConnectedCB();
              }
            });
          };
          that.socket.onclose = function () {
            console.log("serial board websocket disconnected.");
          };
        },
        /**
         *  删除websocket重复连接
         */
        removes: function () {
          if (this.socket != null) {
            if (0 != this.socket.readyState) {
              this.socket.close();
            }
          }
        },
        /**
         * 打开设备
         * @param {void} callback 回调函数
         */
        open: function (callback) {
          openCompletedCB = callback;
          lockExternBoardObject.open(function (return_code) {
            if (0 != return_code) {
              openCompletedCB(return_code);
            }
          });
        },
        /**
         * 关闭设备
         * @param {void} callback 回调函数
         */
        close: function (callback) {
          closeCompletedCB = callback;
          lockExternBoardObject.close(function (return_code) {
            if (0 != return_code) {
              closeCompletedCB(return_code);
            }
          });
        },
        /**
         * 重置设备
         * @param {void} callback 回调函数
         */
        reset: function (callback) {
          resetCompletedCB = callback;
          lockExternBoardObject.reset(function (return_code) {
            if (0 != return_code) {
              resetCompletedCB(return_code);
            }
          });
        },
        /**
         * 获取固件信息
         * @param {void} callback 回调函数
         * @param {int} board_adr (数值，板地址，取值范围1-15)
         */
        getFirmwareInfo: function (board_adr, callback) {
          getFirmwareInfoCompletedCB = callback;
          lockExternBoardObject.get_firmware_info(
            board_adr,
            function (return_code) {
              if (0 != return_code) {
                getFirmwareInfoCompletedCB(return_code);
              }
            }
          );
        },
        /**
         * 打开单个锁
         * @param {void} callback 回调函数
         * @param {int} board_adr (数值，板地址，取值范围1-15)
         * @param {int} lock_num (数值，锁编号，取值范围1-21)
         */
        openLock: function (board_adr, lock_num, callback) {
          openLockCompletedCB = callback;
          lockExternBoardObject.open_lock(
            board_adr,
            lock_num,
            function (return_code) {
              if (0 != return_code) {
                openLockCompletedCB(return_code);
              }
            }
          );
        },
        /**
         * 打开所有锁
         * @param {void} callback 回调函数
         */
        openLockAll: function (callback) {
          openLockAllCompletedCB = callback;
          lockExternBoardObject.open_lock_all(function (return_code) {
            if (0 != return_code) {
              openLockAllCompletedCB(return_code);
            }
          });
        },
        /**
         * 打开格灯
         * @param {void} callback 回调函数
         * @param {int} board_adr (数值，板地址，取值范围1-15)
         * @param {int} light_num (数值，格灯编号，取值范围1-21)
         */
        openLight: function (board_adr, light_num, callback) {
          openLightCompletedCB = callback;
          lockExternBoardObject.open_light(
            board_adr,
            light_num,
            function (return_code) {
              if (0 != return_code) {
                openLightCompletedCB(return_code);
              }
            }
          );
        },
        /**
         * 关闭格灯
         * @param {void} callback 回调函数
         * @param {int} board_adr (数值，板地址，取值范围1-15)
         * @param {int} light_num (数值，格灯编号，取值范围1-21)
         */
        closeLight: function (board_adr, light_num, callback) {
          closeLightCompletedCB = callback;
          lockExternBoardObject.close_light(
            board_adr,
            light_num,
            function (return_code) {
              if (0 != return_code) {
                closeLightCompletedCB(return_code);
              }
            }
          );
        },
        /**
         * 获取单个锁状态
         * @param {void} callback 回调函数
         * @param {int} board_adr (数值，板地址，取值范围1-15)
         * @param {int} lock_num (数值，锁编号，取值范围1-21)
         */
        getLockStatus: function (board_adr, lock_num, callback) {
          getLockStatusCompletedCB = callback;
          lockExternBoardObject.get_lock_status(
            board_adr,
            lock_num,
            function (return_code) {
              if (0 != return_code) {
                getLockStatusCompletedCB(return_code);
              }
            }
          );
        },
        /**
         * 获取所有锁状态
         * @param {void} callback 回调函数
         */
        getAllLockStatus: function (callback) {
          getAllLockStatusCompletedCB = callback;
          lockExternBoardObject.get_all_lock_status(function (return_code) {
            if (0 != return_code) {
              getAllLockStatusCompletedCB(return_code);
            }
          });
        },
      },
    }),
    //扫描类
    (Scanner = {
      //二维码扫描仪
      BarcodeScanner: {
        //连接二维码扫描仪设备接口的回调函数
        barcodeScannerConnectedCB: function () {},
        //打开设备接口的回调函数
        openCompletedCB: function () {},
        //关闭设备接口的回调函数
        closeCompletedCB: function () {},
        //重置设备接口的回调函数
        resetCompletedCB: function () {},
        //获取设备固件版本接口的回调函数
        getFirmwareVersionCompletedCB: function () {},
        //扫描条码信息接口的回调函数
        scannedInformationCompletedCB: function () {},
        //启动连续扫描模式接口的回调函数
        startedScanTaskCompletedCB: function () {},
        //停止连续扫描模式接口的回调函数
        stoppedScanTaskCompletedCB: function () {},
        socket: null,
        /**
         * WebSocket通讯连接二维码设备
         * @param callback (类型：void,说明：回调函数)
         */
        connected: function (callback) {
          barcodeScannerConnectedCB = callback;
          var that = this;
          that.removesWebsocket();
          that.socket = new WebSocket("ws://localhost:8083");
          that.socket.onopen = function () {
            new QWebChannel(that.socket, function (channel) {
              //获取二维码对象
              barcodeScannerObject =
                channel.objects.barcodeScannerSuperLead7130;
              //打开设备返回的信号
              barcodeScannerObject.sig_opened.connect(function (return_code) {
                openCompletedCB(return_code);
              });
              //关闭设备返回的信号
              barcodeScannerObject.sig_closed.connect(function (return_code) {
                closeCompletedCB(return_code);
              });
              //重置设备返回的信号
              barcodeScannerObject.sig_reset.connect(function (return_code) {
                resetCompletedCB(return_code);
              });
              //获取固件版本号返回的信号
              barcodeScannerObject.sig_getted_firmware_version.connect(
                function (return_code, firmware) {
                  getFirmwareVersionCompletedCB(return_code, firmware);
                }
              );
              //扫描条码信息返回的信号
              barcodeScannerObject.sig_scanned_information.connect(function (
                return_code
              ) {
                scannedInformationCompletedCB(return_code);
              });
              //上报单次条码信息返回的信号
              barcodeScannerObject.sig_scanned_barcode_information.connect(
                function (return_code, info) {
                  scannedInformationCompletedCB(return_code, info);
                }
              );
              //启动连续扫描模式返回的信号
              barcodeScannerObject.sig_started_scan_task.connect(function (
                return_code
              ) {
                startedScanTaskCompletedCB(return_code);
              });
              //上报多次条码信息返回的信号
              barcodeScannerObject.sig_getted_barcode_information.connect(
                function (return_code, info) {
                  startedScanTaskCompletedCB(return_code, info);
                }
              );
              //停止连续扫描模式返回的信号
              barcodeScannerObject.sig_stopped_scan_task.connect(function (
                return_code
              ) {
                stoppedScanTaskCompletedCB(return_code);
              });

              if (typeof barcodeScannerConnectedCB == "function") {
                barcodeScannerConnectedCB();
              }
            });
          };
          that.socket.onclose = function () {
            console.log("serial board websocket disconnected.");
          };
        },
        /**
         *  删除websocket重复连接
         */
        removesWebsocket: function () {
          if (this.socket != null) {
            if (0 != this.socket.readyState) {
              this.socket.close();
            }
          }
        },
        /**
         * 打开设备
         * @param {void} callback 回调函数
         */
        open: function (callback) {
          openCompletedCB = callback;
          barcodeScannerObject.open(function (return_code) {
            if (0 != return_code) {
              openCompletedCB(return_code);
            }
          });
        },
        /**
         * 关闭设备
         * @param {void} callback 回调函数
         */
        close: function (callback) {
          closeCompletedCB = callback;
          barcodeScannerObject.close(function (return_code) {
            if (0 != return_code) {
              closeCompletedCB(return_code);
            }
          });
        },
        /**
         * 重置设备
         * @param {void} callback 回调函数
         */
        reset: function (callback) {
          resetCompletedCB = callback;
          barcodeScannerObject.reset(function (return_code) {
            if (0 != return_code) {
              resetCompletedCB(return_code);
            }
          });
        },
        /**
         * 获取固件版本信息
         * @param {void} callback 回调函数
         */
        getFirmwareVersion: function (callback) {
          getFirmwareVersionCompletedCB = callback;
          barcodeScannerObject.get_firmware_version(function (return_code) {
            if (0 != return_code) {
              getFirmwareVersionCompletedCB(return_code);
            }
          });
        },
        /**
         * 扫描条码信息
         * @param {void} callback 回调函数
         */
        scanInformation: function (callback) {
          scannedInformationCompletedCB = callback;
          barcodeScannerObject.scan_information(function (return_code) {
            if (0 != return_code) {
              scannedInformationCompletedCB(return_code);
            }
          });
        },
        /**
         * 启动连续扫描模式
         * @param {void} callback 回调函数
         */
        startScanTask: function (callback) {
          startedScanTaskCompletedCB = callback;
          barcodeScannerObject.start_scan_task(function (return_code) {
            if (0 != return_code) {
              startedScanTaskCompletedCB(return_code);
            }
          });
        },
        /**
         * 停止连续扫描模式
         * @param {void} callback 回调函数
         */
        stopScanTask: function (callback) {
          stoppedScanTaskCompletedCB = callback;
          barcodeScannerObject.stop_scan_task(function (return_code) {
            if (0 != return_code) {
              stoppedScanTaskCompletedCB(return_code);
            }
          });
        },
      },
    }),
    //人脸识别
    (FaceRecognize = {
      //连接人脸识别设备接口的回调函数
      FaceRecognizeConnectedCB: function () {},
      //打开人脸预览接口的回调函数
      startFaceViewCompletedCB: function () {},
      //关闭人脸预览接口的回调函数
      stopFaceViewCompletedCB: function () {},
      //打开人脸检测功能接口的回调函数
      startFaceDetectionCompletedCB: function () {},
      //关闭人脸检测功能接口的回调函数
      stopFaceDetectionCompletedCB: function () {},
      //活体检测成功上报时的回调函数
      getFaceDetectionImgCompletedCB: function () {},
      //获取当前人脸图像接口的回调函数
      getFaceImageCompletedCB: function () {},
      //人离开时上报时的回调函数
      faceLeaveCompletedCB: function () {},
      //添加人脸接口的回调函数
      pushFaceCompletedCB: function () {},
      //查询人脸数量接口的回调函数
      getFaceCountCompletedCB: function () {},
      //根据用户id获取人脸图片接口的回调函数
      getFaceByUserIDCompletedCB: function () {},
      //删除人脸接口的回调函数
      delFaceByUserIDCompletedCB: function () {},
      //清空人脸库接口的回调函数
      delAllFaceCompletedCB: function () {},
      //一比一人脸识别接口的回调函数
      oneToOneFaceRecogCompletedCB: function () {},
      //一比N人脸识别接口的回调函数
      oneToNumberRecognizeCompletedCB: function () {},
      socket: null,
      format: null,
      /**
       * WebSocket通讯连接二维码设备
       * @param callback (类型：void,说明：回调函数)
       */
      connected: function (callback) {
        var that = this;
        that.removesWebsocket();
        FaceRecognizeConnectedCB = callback;
        that.socket = new WebSocket("ws://localhost:8099");
        that.socket.onopen = function () {
          new QWebChannel(that.socket, function (channel) {
            //获取人脸识别对象
            FaceRecognizeObject = channel.objects.faceCameraDvt;
            //打开人脸预览接口返回的信号
            FaceRecognizeObject.sig_enable_preview_stream_completed.connect(
              function (return_code) {
                startFaceViewCompletedCB(return_code);
              }
            );
            //关闭人脸预览接口返回的信号
            FaceRecognizeObject.sig_disable_preview_stream_completed.connect(
              function (return_code) {
                stopFaceViewCompletedCB(return_code);
              }
            );
            //打开人脸检测功能接口返回的信号
            FaceRecognizeObject.sig_enable_face_detect_completed.connect(
              function (return_code) {
                startFaceDetectionCompletedCB(return_code);
              }
            );
            //关闭人脸检测功能接口返回的信号
            FaceRecognizeObject.sig_disable_face_detect_completed.connect(
              function (return_code) {
                stopFaceDetectionCompletedCB(return_code);
              }
            );
            //获取当前人脸图像接口返回的信号
            FaceRecognizeObject.sig_get_face_image_completed.connect(function (
              return_code
            ) {
              that.getFaceImageCompletedCB(return_code);
            });
            //获取图片数据上报返回的信号
            FaceRecognizeObject.sig_report_face_image.connect(function (
              return_code,
              image_base64,
              format
            ) {
              getFaceDetectionImgCompletedCB(return_code, image_base64, format);
              that.getFaceImageCompletedCB(return_code, image_base64, format);
            });
            //人离开时返回的信号
            FaceRecognizeObject.sig_report_face_leave.connect(function (
              return_code,
              status
            ) {
              faceLeaveCompletedCB(return_code, status);
            });
            //添加人脸接口返回的信号
            FaceRecognizeObject.sig_add_face_to_database_completed.connect(
              function (return_code) {
                console.log("pushFaceCompleted==" + return_code);
                pushFaceCompletedCB(return_code);
              }
            );
            // 查询人脸数量接口返回的信号
            FaceRecognizeObject.sig_get_face_count_completed.connect(function (
              return_code,
              face_count
            ) {
              getFaceCountCompletedCB(return_code, face_count);
            });
            //根据用户id获取人脸图片接口返回的信号
            FaceRecognizeObject.sig_get_face_image_by_user_id_completed.connect(
              function (return_code, face_base64, img_format) {
                getFaceByUserIDCompletedCB(
                  return_code,
                  face_base64,
                  img_format
                );
              }
            );
            //打开人脸预览接口返回的信号
            FaceRecognizeObject.sig_delete_face_in_database_completed.connect(
              function (return_code) {
                delFaceByUserIDCompletedCB(return_code);
              }
            );
            //删除人脸接口返回的信号
            FaceRecognizeObject.sig_reset_face_database_completed.connect(
              function (return_code) {
                delAllFaceCompletedCB(return_code);
              }
            );
            //一比一人脸识别接口返回的信号
            FaceRecognizeObject.sig_one_to_one_recognize_completed.connect(
              function (return_code) {
                oneToOneFaceRecogCompletedCB(return_code);
              }
            );
            //一比一人脸识别结果上报返回的信号
            FaceRecognizeObject.sig_report_one_to_one_recognize_result.connect(
              function (return_code, score) {
                oneToOneFaceRecogCompletedCB(return_code, score);
              }
            );
            //一比N人脸识别接口返回的信号
            FaceRecognizeObject.sig_one_to_number_recognize_completed.connect(
              function (return_code) {
                oneToNumberRecognizeCompletedCB(return_code);
              }
            );
            //一比N人脸识别结果上报返回的信号
            FaceRecognizeObject.sig_report_one_to_number_recognize_result.connect(
              function (return_code, score, user_id) {
                oneToNumberRecognizeCompletedCB(return_code, score, user_id);
              }
            );
            if (typeof FaceRecognizeConnectedCB == "function") {
              FaceRecognizeConnectedCB();
            }
          });
        };
        that.socket.onclose = function () {
          console.log("serial board websocket disconnected.");
        };
      },
      /**
       * 删除websocket重复连接
       */
      removesWebsocket: function () {
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
      },
      /**
       * 打开人脸预览
       * @param {int} width (预览图像的宽度像素，以实际摄像头的规格参数为准)
       * @param {int} height (预览图像的高度像素，以实际摄像头的规格参数为准)
       * @param {int} rotate (旋转角度, 0 ：不旋转, 90：顺时针旋转90度, 180 ：顺时针旋转180度, 270 ：顺时针旋转270度)
       * @param {void} callback 回调函数
       */

      startFaceView: function (width, height, rotate, callback) {
        //人脸预览
        startFaceViewCompletedCB = callback;
        FaceRecognizeObject.enable_preview_stream(
          width,
          height,
          rotate,
          function (return_code) {
            if (0 != return_code) {
              startFaceViewCompletedCB(return_code);
            }
          }
        );
      },
      /**
       * 关闭人脸预览
       * @param {void} callback 回调函数
       */
      stopFaceView: function (callback) {
        stopFaceViewCompletedCB = callback;
        FaceRecognizeObject.disable_preview_stream(function (return_code) {
          if (0 != return_code) {
            stopFaceViewCompletedCB(return_code);
          }
        });
      },
      /**
       * 打开人脸检测功能
       * @param {int} format (人脸图像格式, 0：bmg, 1：jpg)
       * @param {void} callback 回调函数
       */
      startFaceDetection: function (format, callback) {
        startFaceDetectionCompletedCB = callback;
        getFaceDetectionImgCompletedCB = callback;
        faceLeaveCompletedCB = callback;
        FaceRecognizeObject.enable_face_detect(format, function (return_code) {
          if (0 != return_code) {
            startFaceDetectionCompletedCB(return_code);
          }
        });
      },
      /**
       * 关闭人脸检测功能
       * @param {void} callback 回调函数
       */
      stopFaceDetection: function (callback) {
        stopFaceDetectionCompletedCB = callback;
        FaceRecognizeObject.disable_face_detect(function (return_code) {
          if (0 != return_code) {
            stopFaceDetectionCompletedCB(return_code);
          }
        });
      },
      /**
       * 获取当前人脸图像
       * @param {void} callback 回调函数
       */
      getFaceImage: function (callback) {
        ("获取当前人脸");
        getFaceImageCompletedCB = callback;
        FaceRecognizeObject.get_face_image(function (return_code) {
          if (0 != return_code) {
            getFaceImageCompletedCB(return_code);
          }
        });
      },
      /**
       * 添加人脸
       * @param {string} img_base64 (人脸图像的base64数据)
       * @param {string} img_format (人脸图像格式 , 0：bmg, 1：jpg)
       * @param {int} user_id (用户id编号，长度为20个字节以内)
       * @param {void} callback 回调函数
       */
      pushFace: function (img_base64, img_format, user_id, callback) {
        pushFaceCompletedCB = callback;
        FaceRecognizeObject.add_face_to_database(
          user_id,
          img_base64,
          img_format,
          function (return_code) {
            "pushFace==" + return_code;
            if (0 != return_code) {
              pushFaceCompletedCB(return_code);
            }
          }
        );
      },
      /**
       * 查询人脸数量
       * @param {void} callback 回调函数
       */
      getFaceCount: function (callback) {
        getFaceCountCompletedCB = callback;
        FaceRecognizeObject.get_face_count(function (return_code) {
          if (0 != return_code) {
            getFaceCountCompletedCB(return_code);
          }
        });
      },
      /**
       * 根据用户id获取人脸图片
       * @param {int} user_id （用户id编号，长度为20个字节以内）
       * @param {void} callback 回调函数
       */
      getFaceByUserID: function (user_id, callback) {
        getFaceByUserIDCompletedCB = callback;
        FaceRecognizeObject.get_face_image_by_user_id(
          user_id,
          function (return_code) {
            /*if (0 != return_code) {
                                                                      getFaceByUserIDCompletedCB(return_code);
                                                                  }*/
          }
        );
      },
      /**
       * 删除人脸
       * @param {int} user_id （用户id编号，长度为20个字节以内）
       * @param {void} callback 回调函数
       */
      delFaceByUserID: function (user_id, callback) {
        delFaceByUserIDCompletedCB = callback;
        FaceRecognizeObject.delete_face_in_database(
          user_id,
          function (return_code) {
            if (0 != return_code) {
              delFaceByUserIDCompletedCB(return_code);
            }
          }
        );
      },
      /**
       * 一比N人脸识别
       * @param {string} image_base64 (人脸图像的base64数据)
       * @param {int} format (人脸图片格式 , 0：bmp, 1：jpg)
       * @param {void} callback 回调函数
       */
      oneToNumberRecognize: function (image_base64, format, callback) {
        oneToNumberRecognizeCompletedCB = callback;
        FaceRecognizeObject.one_to_number_recognize(
          image_base64,
          format,
          function (return_code) {
            if (0 != return_code) {
              oneToNumberRecognizeCompletedCB(return_code);
            }
          }
        );
      },
      /**
       * 清空人脸库
       * @param {void} callback 回调函数
       */
      delAllFace: function (callback) {
        delAllFaceCompletedCB = callback;
        FaceRecognizeObject.reset_face_database(function (return_code) {
          if (0 != return_code) {
            delAllFaceCompletedCB(return_code);
          }
        });
      },
      /**
       * 一比一人脸识别
       * @param {string} faceA_base64 (A人脸图片base64数据)
       * @param {int} faceA_format (A人脸图片格式 , 0：bmp ,1：jpg)
       * @param {string} faceB_base64 (B人脸图片base64数据)
       * @param {int} faceB_format (B人脸图片格式 , 0：bmp ,1：jpg)
       * @param {void} callback 回调函数
       */
      oneToOneFaceRecog: function (
        faceA_base64,
        faceA_format,
        faceB_base64,
        faceB_format,
        callback
      ) {
        oneToOneFaceRecogCompletedCB = callback;
        reportOneToOneRecogDataCompletedCB = callback;
        FaceRecognizeObject.one_to_one_recognize(
          faceA_base64,
          faceA_format,
          faceB_base64,
          faceB_format,
          function (return_code) {
            return_code;
            if (0 != return_code) {
              oneToOneFaceRecogCompletedCB(return_code);
            }
          }
        );
      },
    }),
    // 8016
    (FaceRecognize8016 = {
      //连接人脸识别设备接口的回调函数
      FaceRecognizeConnectedCB_8016: function () {},
      //打开人脸预览接口的回调函数
      startFaceViewCompletedCB_8016: function () {},
      //关闭人脸预览接口的回调函数
      stopFaceViewCompletedCB_8016: function () {},
      //打开人脸检测功能接口的回调函数
      startFaceDetectionCompletedCB_8016: function () {},
      //关闭人脸检测功能接口的回调函数
      stopFaceDetectionCompletedCB_8016: function () {},
      //活体检测成功上报时的回调函数
      getFaceDetectionImgCompletedCB_8016: function () {},
      //获取当前人脸图像接口的回调函数
      getFaceImageCompletedCB_8016: function () {},
      //人离开时上报时的回调函数
      faceLeaveCompletedCB_8016: function () {},
      //添加人脸接口的回调函数
      pushFaceCompletedCB_8016: function () {},
      //查询人脸数量接口的回调函数
      getFaceCountCompletedCB_8016: function () {},
      //根据用户id获取人脸图片接口的回调函数
      getFaceByUserIDCompletedCB_8016: function () {},
      //删除人脸接口的回调函数
      delFaceByUserIDCompletedCB_8016: function () {},
      //清空人脸库接口的回调函数
      delAllFaceCompletedCB_8016: function () {},
      //一比一人脸识别接口的回调函数
      oneToOneFaceRecogCompletedCB_8016: function () {},
      //一比N人脸识别接口的回调函数
      oneToNumberRecognizeCompletedCB_8016: function () {},
      socket: null,
      /**
       * WebSocket通讯连接二维码设备
       * @param callback (类型：void,说明：回调函数)
       */
      connected: function (callback) {
        var that = this;
        that.removesWebsocket();
        FaceRecognizeConnectedCB_8016 = callback;
        that.socket = new WebSocket("ws://localhost:8099");
        that.socket.onopen = function () {
          new QWebChannel(that.socket, function (channel) {
            //获取人脸识别对象
            FaceRecognizeObject = channel.objects.faceCameraDvt8016;
            //打开人脸预览接口返回的信号
            FaceRecognizeObject.sig_enable_preview_stream_completed.connect(
              function (return_code) {
                startFaceViewCompletedCB_8016(return_code);
              }
            );
            //关闭人脸预览接口返回的信号
            FaceRecognizeObject.sig_disable_preview_stream_completed.connect(
              function (return_code) {
                stopFaceViewCompletedCB_8016(return_code);
              }
            );
            //打开人脸检测功能接口返回的信号
            FaceRecognizeObject.sig_enable_face_detect_completed.connect(
              function (return_code) {
                "2676", return_code;
                startFaceDetectionCompletedCB_8016(return_code);
              }
            );
            //关闭人脸检测功能接口返回的信号
            FaceRecognizeObject.sig_disable_face_detect_completed.connect(
              function (return_code) {
                stopFaceDetectionCompletedCB_8016(return_code);
              }
            );
            //获取当前人脸图像接口返回的信号
            FaceRecognizeObject.sig_get_face_image_completed.connect(function (
              return_code
            ) {
              that.getFaceImageCompletedCB_8016(return_code);
            });
            //获取图片数据上报返回的信号
            FaceRecognizeObject.sig_report_face_image.connect(function (
              return_code,
              image_base64,
              format
            ) {
              getFaceDetectionImgCompletedCB_8016(
                return_code,
                image_base64,
                format
              );
              that.getFaceImageCompletedCB_8016(
                return_code,
                image_base64,
                format
              );
            });
            //人离开时返回的信号
            FaceRecognizeObject.sig_report_face_leave.connect(function (
              return_code,
              status
            ) {
              faceLeaveCompletedCB_8016(return_code, status);
            });
            //添加人脸接口返回的信号
            FaceRecognizeObject.sig_add_face_to_database_completed.connect(
              function (return_code) {
                console.log("pushFaceCompleted==" + return_code);
                pushFaceCompletedCB_8016(return_code);
              }
            );
            // 查询人脸数量接口返回的信号
            FaceRecognizeObject.sig_get_face_count_completed.connect(function (
              return_code,
              face_count
            ) {
              getFaceCountCompletedCB_8016(return_code, face_count);
            });
            //根据用户id获取人脸图片接口返回的信号
            FaceRecognizeObject.sig_get_face_image_by_user_id_completed.connect(
              function (return_code, face_base64, img_format) {
                getFaceByUserIDCompletedCB_8016(
                  return_code,
                  face_base64,
                  img_format
                );
              }
            );
            //打开人脸预览接口返回的信号
            FaceRecognizeObject.sig_delete_face_in_database_completed.connect(
              function (return_code) {
                delFaceByUserIDCompletedCB_8016(return_code);
              }
            );
            //删除人脸接口返回的信号
            FaceRecognizeObject.sig_reset_face_database_completed.connect(
              function (return_code) {
                delAllFaceCompletedCB_8016(return_code);
              }
            );
            //一比一人脸识别接口返回的信号
            FaceRecognizeObject.sig_one_to_one_recognize_completed.connect(
              function (return_code) {
                oneToOneFaceRecogCompletedCB_8016(return_code);
              }
            );
            //一比一人脸识别结果上报返回的信号
            FaceRecognizeObject.sig_report_one_to_one_recognize_result.connect(
              function (return_code, score) {
                oneToOneFaceRecogCompletedCB_8016(return_code, score);
              }
            );
            //一比N人脸识别接口返回的信号
            FaceRecognizeObject.sig_one_to_number_recognize_completed.connect(
              function (return_code) {
                oneToNumberRecognizeCompletedCB_8016(return_code);
              }
            );
            //一比N人脸识别结果上报返回的信号
            FaceRecognizeObject.sig_report_one_to_number_recognize_result.connect(
              function (return_code, score, user_id) {
                oneToNumberRecognizeCompletedCB_8016(
                  return_code,
                  score,
                  user_id
                );
              }
            );
            if (typeof FaceRecognizeConnectedCB_8016 == "function") {
              FaceRecognizeConnectedCB_8016();
            }
          });
        };
        that.socket.onclose = function () {
          console.log("serial board websocket disconnected.");
        };
      },
      /**
       * 删除websocket重复连接
       */
      removesWebsocket: function () {
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
      },
      /**
       * 打开人脸预览
       * @param {int} width (预览图像的宽度像素，以实际摄像头的规格参数为准)
       * @param {int} height (预览图像的高度像素，以实际摄像头的规格参数为准)
       * @param {int} rotate (旋转角度, 0 ：不旋转, 90：顺时针旋转90度, 180 ：顺时针旋转180度, 270 ：顺时针旋转270度)
       * @param {void} callback 回调函数
       */

      startFaceView: function (width, height, rotate, callback) {
        //人脸预览
        startFaceViewCompletedCB_8016 = callback;
        FaceRecognizeObject.enable_preview_stream(
          width,
          height,
          rotate,
          function (return_code) {
            console.log(return_code);
            if (0 != return_code) {
              startFaceViewCompletedCB_8016(return_code);
            }
          }
        );
      },
      /**
       * 关闭人脸预览
       * @param {void} callback 回调函数
       */
      stopFaceView: function (callback) {
        stopFaceViewCompletedCB_8016 = callback;
        FaceRecognizeObject.disable_preview_stream(function (return_code) {
          if (0 != return_code) {
            stopFaceViewCompletedCB_8016(return_code);
          }
        });
      },
      /**
       * 打开人脸检测功能
       * @param {int} format (人脸图像格式, 0：bmg, 1：jpg)
       * @param {void} callback 回调函数
       */
      startFaceDetection: function (format, callback) {
        startFaceDetectionCompletedCB_8016 = callback;
        getFaceDetectionImgCompletedCB_8016 = callback;
        faceLeaveCompletedCB_8016 = callback;
        FaceRecognizeObject.enable_face_detect(format, function (return_code) {
          if (0 != return_code) {
            startFaceDetectionCompletedCB_8016(return_code);
          }
        });
      },
      /**
       * 关闭人脸检测功能
       * @param {void} callback 回调函数
       */
      stopFaceDetection: function (callback) {
        stopFaceDetectionCompletedCB_8016 = callback;
        FaceRecognizeObject.disable_face_detect(function (return_code) {
          if (0 != return_code) {
            stopFaceDetectionCompletedCB_8016(return_code);
          }
        });
      },
      /**
       * 获取当前人脸图像
       * @param {void} callback 回调函数
       */
      getFaceImage: function (callback) {
        var getFaceImageCompletedCB_8016 = callback;
        FaceRecognizeObject.get_face_image(function (return_code) {
          if (0 != return_code) {
            getFaceImageCompletedCB_8016(return_code);
          }
        });
      },
      /**
       * 添加人脸
       * @param {string} img_base64 (人脸图像的base64数据)
       * @param {string} img_format (人脸图像格式 , 0：bmg, 1：jpg)
       * @param {int} user_id (用户id编号，长度为20个字节以内)
       * @param {void} callback 回调函数
       */
      pushFace: function (img_base64, img_format, user_id, callback) {
        pushFaceCompletedCB_8016 = callback;
        FaceRecognizeObject.add_face_to_database(
          user_id,
          img_base64,
          img_format,
          function (return_code) {
            console.log("pushFace==" + return_code);
            if (0 != return_code) {
              pushFaceCompletedCB_8016(return_code);
            }
          }
        );
      },
      /**
       * 查询人脸数量
       * @param {void} callback 回调函数
       */
      getFaceCount: function (callback) {
        getFaceCountCompletedCB_8016 = callback;
        FaceRecognizeObject.get_face_count(function (return_code) {
          if (0 != return_code) {
            getFaceCountCompletedCB_8016(return_code);
          }
        });
      },
      /**
       * 根据用户id获取人脸图片
       * @param {int} user_id （用户id编号，长度为20个字节以内）
       * @param {void} callback 回调函数
       */
      getFaceByUserID: function (user_id, callback) {
        getFaceByUserIDCompletedCB_8016 = callback;
        FaceRecognizeObject.get_face_image_by_user_id(
          user_id,
          function (return_code) {
            /*if (0 != return_code) {
                                                                      getFaceByUserIDCompletedCB(return_code);
                                                                  }*/
          }
        );
      },
      /**
       * 删除人脸
       * @param {int} user_id （用户id编号，长度为20个字节以内）
       * @param {void} callback 回调函数
       */
      delFaceByUserID: function (user_id, callback) {
        delFaceByUserIDCompletedCB_8016 = callback;
        FaceRecognizeObject.delete_face_in_database(
          user_id,
          function (return_code) {
            if (0 != return_code) {
              delFaceByUserIDCompletedCB_8016(return_code);
            }
          }
        );
      },
      /**
       * 一比N人脸识别
       * @param {string} image_base64 (人脸图像的base64数据)
       * @param {int} format (人脸图片格式 , 0：bmp, 1：jpg)
       * @param {void} callback 回调函数
       */
      oneToNumberRecognize: function (image_base64, format, callback) {
        oneToNumberRecognizeCompletedCB_8016 = callback;
        FaceRecognizeObject.one_to_number_recognize(
          image_base64,
          format,
          function (return_code) {
            if (0 != return_code) {
              oneToNumberRecognizeCompletedCB_8016(return_code);
            }
          }
        );
      },
      /**
       * 清空人脸库
       * @param {void} callback 回调函数
       */
      delAllFace: function (callback) {
        delAllFaceCompletedCB_8016 = callback;
        FaceRecognizeObject.reset_face_database(function (return_code) {
          if (0 != return_code) {
            delAllFaceCompletedCB_8016(return_code);
          }
        });
      },
      /**
       * 一比一人脸识别
       * @param {string} faceA_base64 (A人脸图片base64数据)
       * @param {int} faceA_format (A人脸图片格式 , 0：bmp ,1：jpg)
       * @param {string} faceB_base64 (B人脸图片base64数据)
       * @param {int} faceB_format (B人脸图片格式 , 0：bmp ,1：jpg)
       * @param {void} callback 回调函数
       */
      oneToOneFaceRecog: function (
        faceA_base64,
        faceA_format,
        faceB_base64,
        faceB_format,
        callback
      ) {
        oneToOneFaceRecogCompletedCB_8016 = callback;
        reportOneToOneRecogDataCompletedCB = callback;
        FaceRecognizeObject.one_to_one_recognize(
          faceA_base64,
          faceA_format,
          faceB_base64,
          faceB_format,
          function (return_code) {
            console.log(return_code);
            if (0 != return_code) {
              oneToOneFaceRecogCompletedCB_8016(return_code);
            }
          }
        );
      },
    }),
    //商汤人脸识别
    (stwebfacecamera = {
      webfacecameraConnectedCB: function () {},
      getStateCompletedCB: function () {},
      getInfoCompletedCB: function () {},
      setDefaultOptionsCompletedCB: function () {},
      openViewCompletedCB: function () {},
      closeViewCompletedCB: function () {},
      startFaceViewCompletedCB: function () {},
      stopFaceViewCompletedCB: function () {},
      startFaceDetectionCompletedCB: function () {},
      stopFaceDetectionCompletedCB: function () {},
      getFaceDetectionImgCompletedCB: function () {},
      getFaceImageCompletedCB: function () {},
      faceLeaveCompletedCB: function () {},
      pushFaceCompletedCB: function () {},
      getFaceCountCompletedCB: function () {},
      getUserIDByIndexCompletedCB: function () {},
      getFaceByUserIDCompletedCB: function () {},
      getFaceFeatureByUserIDCompletedCB: function () {},
      delFaceByUserIDCompletedCB: function () {},
      delAllFaceCompletedCB: function () {},
      oneToOneFaceRecogCompletedCB: function () {},
      oneToNumberRecognizeCompletedCB: function () {},
      connected: function (callback) {
        webfacecameraConnectedCB = callback;
        var that = this;
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
        that.socket = new WebSocket("ws://localhost:8090");
        that.socket.onopen = function () {
          new QWebChannel(that.socket, function (channel) {
            webfacecameraObject = channel.objects.faceCameraSt;
            webfacecameraObject.sig_enable_preview_stream_completed.connect(
              function (return_code) {
                console.log(return_code);
                startFaceViewCompletedCB(return_code);
              }
            );
            webfacecameraObject.sig_disable_preview_stream_completed.connect(
              function (return_code) {
                stopFaceViewCompletedCB(return_code);
              }
            );
            webfacecameraObject.sig_enable_face_detect_completed.connect(
              function (return_code) {
                startFaceDetectionCompletedCB(return_code);
              }
            );
            webfacecameraObject.sig_disable_face_detect_completed.connect(
              function (return_code) {
                stopFaceDetectionCompletedCB(return_code);
              }
            );
            webfacecameraObject.sig_get_face_image_completed.connect(function (
              return_code
            ) {
              console.log(return_code);
              getFaceImageCompletedCB(return_code);
            });
            webfacecameraObject.sig_report_face_image.connect(function (
              return_code,
              image_base64,
              format
            ) {
              getFaceDetectionImgCompletedCB(return_code, image_base64, format);
              getFaceImageCompletedCB(return_code, image_base64, format);
            });
            webfacecameraObject.sig_report_face_leave.connect(function (
              return_code,
              status
            ) {
              console.log(status);
              faceLeaveCompletedCB(return_code, status);
            });

            webfacecameraObject.sig_add_face_to_database_completed.connect(
              function (return_code) {
                console.log("pushFaceCompleted==" + return_code);
                pushFaceCompletedCB(return_code);
              }
            );
            webfacecameraObject.sig_get_face_count_completed.connect(function (
              return_code,
              face_count
            ) {
              getFaceCountCompletedCB(return_code, face_count);
            });
            webfacecameraObject.sig_get_face_image_by_user_id_completed.connect(
              function (return_code, face_base64, img_format) {
                getFaceByUserIDCompletedCB(
                  return_code,
                  face_base64,
                  img_format
                );
              }
            );
            webfacecameraObject.sig_delete_face_in_database_completed.connect(
              function (return_code) {
                delFaceByUserIDCompletedCB(return_code);
              }
            );
            webfacecameraObject.sig_reset_face_database_completed.connect(
              function (return_code) {
                delAllFaceCompletedCB(return_code);
              }
            );
            webfacecameraObject.sig_one_to_one_recognize_completed.connect(
              function (return_code) {
                oneToOneFaceRecogCompletedCB(return_code);
              }
            );
            webfacecameraObject.sig_report_one_to_one_recognize_result.connect(
              function (return_code, score) {
                oneToOneFaceRecogCompletedCB(return_code, score);
              }
            );
            webfacecameraObject.sig_one_to_number_recognize_completed.connect(
              function (return_code) {
                oneToNumberRecognizeCompletedCB(return_code);
              }
            );
            webfacecameraObject.sig_report_one_to_number_recognize_result.connect(
              function (return_code, score, user_id) {
                oneToNumberRecognizeCompletedCB(return_code, score, user_id);
              }
            );
            if (typeof webfacecameraConnectedCB == "function") {
              webfacecameraConnectedCB();
            }
          });
        };
        that.socket.onclose = function () {
          console.log("serial board websocket disconnected.");
        };
      },
      removes: function () {
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
      },
      startFaceView: function (width, height, callback) {
        //人脸预览
        startFaceViewCompletedCB = callback;
        webfacecameraObject.enable_preview_stream(
          width,
          height,
          0,
          function (return_code) {
            console.log(return_code);
            if (0 != return_code) {
              startFaceViewCompletedCB(return_code);
            }
          }
        );
      },
      stopFaceView: function (callback) {
        //停止人脸预览来来来
        stopFaceViewCompletedCB = callback;
        webfacecameraObject.disable_preview_stream(function (return_code) {
          if (0 != return_code) {
            stopFaceViewCompletedCB(return_code);
          }
        });
      },
      startFaceDetection: function (format, callback) {
        //人脸检测
        startFaceDetectionCompletedCB = callback;
        getFaceDetectionImgCompletedCB = callback;
        faceLeaveCompletedCB = callback;
        webfacecameraObject.enable_face_detect(format, function (return_code) {
          if (0 != return_code) {
            startFaceDetectionCompletedCB(return_code);
          }
        });
      },
      stopFaceDetection: function (callback) {
        //停止人脸检测
        stopFaceDetectionCompletedCB = callback;
        webfacecameraObject.disable_face_detect(function (return_code) {
          if (0 != return_code) {
            stopFaceDetectionCompletedCB(return_code);
          }
        });
      },
      getFaceImage: function (callback) {
        getFaceImageCompletedCB = callback;
        webfacecameraObject.get_face_image(function (return_code) {
          if (0 != return_code) {
            getFaceImageCompletedCB(return_code);
          }
        });
      },
      pushFace: function (img_base64, img_format, user_id, callback) {
        pushFaceCompletedCB = callback;
        console.log("img_base64=", img_base64);
        webfacecameraObject.add_face_to_database(
          user_id,
          img_base64,
          img_format,
          function (return_code) {
            console.log("pushFace==" + return_code);
            if (0 != return_code) {
              pushFaceCompletedCB(return_code);
            }
          }
        );
      },
      getFaceCount: function (callback) {
        getFaceCountCompletedCB = callback;
        webfacecameraObject.get_face_count(function (return_code) {
          if (0 != return_code) {
            getFaceCountCompletedCB(return_code);
          }
        });
      },
      getUserIDByIndex: function (index, callback) {
        getUserIDByIndexCompletedCB = callback;
        webfacecameraObject.getUserIDByIndex(index, function (return_code) {
          console.log("return ==" + return_code);
          if (0 != return_code) {
            getUserIDByIndexCompletedCB(return_code);
          }
        });
      },
      getFaceByUserID: function (user_id, callback) {
        getFaceByUserIDCompletedCB = callback;
        webfacecameraObject.get_face_image_by_user_id(
          user_id,
          function (return_code) {
            /*if (0 != return_code) {
                                                                      getFaceByUserIDCompletedCB(return_code);
                                                                  }*/
          }
        );
      },
      delFaceByUserID: function (user_id, callback) {
        delFaceByUserIDCompletedCB = callback;
        webfacecameraObject.delete_face_in_database(
          user_id,
          function (return_code) {
            if (0 != return_code) {
              delFaceByUserIDCompletedCB(return_code);
            }
          }
        );
      },
      oneToNumberRecognize: function (image_base64, format, callback) {
        oneToNumberRecognizeCompletedCB = callback;
        webfacecameraObject.one_to_number_recognize(
          image_base64,
          format,
          function (return_code) {
            if (0 != return_code) {
              oneToNumberRecognizeCompletedCB(return_code);
            }
          }
        );
      },
      delAllFace: function (callback) {
        delAllFaceCompletedCB = callback;
        webfacecameraObject.reset_face_database(function (return_code) {
          if (0 != return_code) {
            delAllFaceCompletedCB(return_code);
          }
        });
      },
      oneToOneFaceRecog: function (
        faceA_base64,
        faceA_format,
        faceB_base64,
        faceB_format,
        callback
      ) {
        oneToOneFaceRecogCompletedCB = callback;
        reportOneToOneRecogDataCompletedCB = callback;

        webfacecameraObject.one_to_one_recognize(
          faceA_base64,
          faceA_format,
          faceB_base64,
          faceB_format,
          function (return_code) {
            console.log(return_code);
            if (0 != return_code) {
              oneToOneFaceRecogCompletedCB(return_code);
            }
          }
        );
      },
    }),
    //百度人脸识别
    (bdwebfacecameraLht = {
      socket: null,
      webfacecameraConnectedCB: function () {},
      getStateCompletedCB: function () {},
      getInfoCompletedCB: function () {},
      setDefaultOptionsCompletedCB: function () {},

      openViewCompletedCB: function () {},
      closeViewCompletedCB: function () {},
      snapshotCompletedCB: function () {},

      startFaceViewCompletedCB: function () {},
      stopFaceViewCompletedCB: function () {},
      startSnapshotCompletedCB: function () {},
      stopSnapshotCompletedCB: function () {},
      pushFaceCompletedCB: function () {},
      getFaceCountCompletedCB: function () {},
      getUserIDByIndexCompletedCB: function () {},
      getFaceByUserIDCompletedCB: function () {},
      delFaceByUserIDCompletedCB: function () {},
      startFaceRecogCompletedCB: function () {},
      delAllFaceCompletedCB: function () {},
      oneToOneFaceRecogCompletedCB: function () {},
      reportSnapDataCompletedCB: function () {},
      reportRecogDataCompletedCB: function () {},
      reportOneToOneRecogDataCompletedCB: function () {},
      connected: function (callback) {
        webfacecameraConnectedCB = callback;
        var that = this;
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
        that.socket = new WebSocket("ws://localhost:8090");
        that.socket.onopen = function () {
          new QWebChannel(that.socket, function (channel) {
            webfacecameraObject = channel.objects.faceCameraBdLht;

            webfacecameraObject.getStateCompleted.connect(function (
              return_code
            ) {
              console.log(return_code);
              getStateCompletedCB(return_code);
            });
            webfacecameraObject.getInfoCompleted.connect(function (
              return_code,
              info
            ) {
              var info_str = info.toString().split(",,");
              var handwareInfoJson = info_str[0];
              var deviceStateInfoJson = info_str[1];
              var staticI0nfoJson = info_str[2];
              getInfoCompletedCB(
                handwareInfoJson.toString(),
                deviceStateInfoJson.toString(),
                staticI0nfoJson.toString()
              );
            });
            webfacecameraObject.setDefaultOptionsCompleted.connect(function (
              return_code
            ) {
              setDefaultOptionsCompletedCB(return_code);
            });
            webfacecameraObject.openViewCompleted.connect(function (
              return_code
            ) {
              openViewCompletedCB(return_code);
            });
            webfacecameraObject.closeViewCompleted.connect(function (
              return_code
            ) {
              closeViewCompletedCB(return_code);
            });
            webfacecameraObject.snapshotCompleted.connect(function (
              return_code,
              img_path
            ) {
              snapshotCompletedCB(return_code, img_path);
            });

            webfacecameraObject.startFaceViewCompleted.connect(function (
              return_code
            ) {
              console.log(return_code);
              startFaceViewCompletedCB(return_code);
            });

            webfacecameraObject.stopFaceViewCompleted.connect(function (
              return_code
            ) {
              stopFaceViewCompletedCB(return_code);
            });
            webfacecameraObject.startSnapshotCompleted.connect(function (
              return_code
            ) {
              console.log("startSnapshotCompleted..");
              console.log(return_code);
              startSnapshotCompletedCB(return_code);
            });
            webfacecameraObject.stopSnapshotCompleted.connect(function (
              return_code
            ) {
              stopSnapshotCompletedCB(return_code);
            });
            webfacecameraObject.pushFaceCompleted.connect(function (
              return_code
            ) {
              console.log("pushFaceCompleted==" + return_code);
              pushFaceCompletedCB(return_code);
            });
            webfacecameraObject.getFaceCountCompleted.connect(function (
              return_code,
              face_count
            ) {
              getFaceCountCompletedCB(return_code, face_count);
            });
            webfacecameraObject.getUserIDByIndexCompleted.connect(function (
              return_code,
              user_id,
              user_id_len
            ) {
              console.log("getUserIDByIndexCompleted..");
              console.log(user_id);
              getUserIDByIndexCompletedCB(return_code, user_id, user_id_len);
            });
            webfacecameraObject.getFaceByUserIDCompleted.connect(function (
              return_code,
              face_base64,
              base64_len,
              img_format
            ) {
              getFaceByUserIDCompletedCB(
                return_code,
                face_base64,
                base64_len,
                img_format
              );
            });
            webfacecameraObject.delFaceByUserIDCompleted.connect(function (
              return_code
            ) {
              delFaceByUserIDCompletedCB(return_code);
            });
            webfacecameraObject.startFaceRecogCompleted.connect(function (
              return_code
            ) {
              startFaceRecogCompletedCB(return_code);
            });
            webfacecameraObject.delAllFaceCompleted.connect(function (
              return_code
            ) {
              delAllFaceCompletedCB(return_code);
            });
            webfacecameraObject.oneToOneFaceRecogCompleted.connect(function (
              return_code
            ) {
              oneToOneFaceRecogCompletedCB(return_code);
            });
            webfacecameraObject.reportSnapDataCompleted.connect(function (
              return_code,
              result,
              img_base64,
              base64_len,
              img_format,
              img_w,
              img_h
            ) {
              console.log("reportSnapDataCompleted..");
              console.log(return_code);
              console.log(result);

              reportSnapDataCompletedCB(
                return_code,
                result,
                img_base64,
                base64_len,
                img_format,
                img_w,
                img_h
              );
            });
            webfacecameraObject.reportRecogDataCompleted.connect(function (
              return_code,
              result,
              score,
              user_id
            ) {
              reportRecogDataCompletedCB(return_code, result, score, user_id);
            });
            webfacecameraObject.reportOneToOneRecogDataCompleted.connect(
              function (return_code, result, score) {
                console.log(return_code);
                console.log(result);
                console.log(score);
                reportOneToOneRecogDataCompletedCB(return_code, result, score);
              }
            );
            if (typeof webfacecameraConnectedCB == "function") {
              webfacecameraConnectedCB();
            }
          });
        };
        that.socket.onclose = function () {
          console.log("serial board websocket disconnected.");
        };
      },
      removes: function () {
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
      },
      getState: function (callback) {
        getStateCompletedCB = callback;
        webfacecameraObject.getState(function (return_code) {
          if (0 != return_code) {
            getStateCompletedCB(return_code);
          }
        });
      },
      getInfo: function (callback) {
        getInfoCompletedCB = callback;
        webfacecameraObject.getInfo(function (return_code) {
          if (0 != return_code) {
            getInfoCompletedCB("{}", "{}", "{}");
          }
        });
      },
      setDefaultOptions: function (options, callback) {
        setDefaultOptionsCompletedCB = callback;
        webfacecameraObject.setDefaultOptions(
          JSON.stringify(options),
          function (return_code) {
            if (0 != return_code) {
              setDefaultOptionsCompletedCB(return_code);
            }
          }
        );
      },
      openView: function (win_x, win_y, img_w, img_h, callback) {
        openViewCompletedCB = callback;
        webfacecameraObject.openView(
          win_x,
          win_y,
          img_w,
          img_h,
          function (return_code) {
            if (0 != return_code) {
              openViewCompletedCB(return_code);
            }
          }
        );
      },
      closeView: function (callback) {
        closeViewCompletedCB = callback;
        webfacecameraObject.closeView(function (return_code) {
          if (0 != return_code) {
            closeViewCompletedCB(return_code);
          }
        });
      },
      snapshot: function (img_w, img_h, callback) {
        snapshotCompletedCB = callback;
        webfacecameraObject.snapshot(img_w, img_h, function (return_code) {
          if (0 != return_code) {
            snapshotCompletedCB(return_code);
          }
        });
      },
      startFaceView: function (img_w, img_h, callback) {
        startFaceViewCompletedCB = callback;
        console.log(img_w);
        console.log(img_h);
        webfacecameraObject.startFaceView(img_w, img_h, function (return_code) {
          console.log(return_code);
          if (0 != return_code) {
            startFaceViewCompletedCB(return_code);
          }
        });
      },
      stopFaceView: function (callback) {
        stopFaceViewCompletedCB = callback;
        webfacecameraObject.stopFaceView(function (return_code) {
          if (0 != return_code) {
            stopFaceViewCompletedCB(return_code);
          }
        });
      },
      startSnapshot: function (img_w, img_h, img_format, callback) {
        startSnapshotCompletedCB = callback;
        reportSnapDataCompletedCB = callback;
        console.log("startSnapshot..");
        console.log(img_w);
        console.log(img_h);
        console.log(img_format);
        webfacecameraObject.startSnapshot(
          img_w,
          img_h,
          img_format,
          function (return_code) {
            if (0 != return_code) {
              startSnapshotCompletedCB(return_code);
            }
          }
        );
      },
      stopSnapshot: function (callback) {
        stopSnapshotCompletedCB = callback;

        webfacecameraObject.stopSnapshot(function (return_code) {
          if (0 != return_code) {
            stopSnapshotCompletedCB(return_code);
          }
        });
      },
      pushFace: function (img_base64, img_format, user_id, callback) {
        pushFaceCompletedCB = callback;
        console.log("img_base64==");
        console.log(img_base64);
        webfacecameraObject.pushFace(
          img_base64,
          img_format,
          user_id,
          function (return_code) {
            console.log("pushFace==" + return_code);
            if (0 != return_code) {
              pushFaceCompletedCB(return_code);
            }
          }
        );
      },
      getFaceCount: function (callback) {
        getFaceCountCompletedCB = callback;
        webfacecameraObject.getFaceCount(function (return_code) {
          if (0 != return_code) {
            getFaceCountCompletedCB(return_code);
          }
        });
      },
      getUserIDByIndex: function (index, callback) {
        getUserIDByIndexCompletedCB = callback;
        webfacecameraObject.getUserIDByIndex(index, function (return_code) {
          console.log("return ==" + return_code);
          if (0 != return_code) {
            getUserIDByIndexCompletedCB(return_code);
          }
        });
      },
      getFaceByUserID: function (user_id, callback) {
        getFaceByUserIDCompletedCB = callback;
        webfacecameraObject.getFaceByUserID(user_id, function (return_code) {
          if (0 != return_code) {
            getFaceByUserIDCompletedCB(return_code);
          }
        });
      },
      delFaceByUserID: function (user_id, callback) {
        delFaceByUserIDCompletedCB = callback;
        webfacecameraObject.delFaceByUserID(user_id, function (return_code) {
          if (0 != return_code) {
            delFaceByUserIDCompletedCB(return_code);
          }
        });
      },
      startFaceRecog: function (callback) {
        startFaceRecogCompletedCB = callback;
        reportRecogDataCompletedCB = callback;

        webfacecameraObject.startFaceRecog(function (return_code) {
          if (0 != return_code) {
            startFaceRecogCompletedCB(return_code);
          }
        });
      },
      delAllFace: function (callback) {
        delAllFaceCompletedCB = callback;
        webfacecameraObject.delAllFace(function (return_code) {
          if (0 != return_code) {
            delAllFaceCompletedCB(return_code);
          }
        });
      },
      oneToOneFaceRecog: function (
        faceA_base64,
        faceA_format,
        faceB_base64,
        faceB_format,
        callback
      ) {
        oneToOneFaceRecogCompletedCB = callback;
        reportOneToOneRecogDataCompletedCB = callback;

        webfacecameraObject.oneToOneFaceRecog(
          faceA_base64,
          faceA_format,
          faceB_base64,
          faceB_format,
          function (return_code) {
            console.log(return_code);
            if (0 != return_code) {
              oneToOneFaceRecogCompletedCB(return_code);
            }
          }
        );
      },
    }),
    //照片打印机
    (PhotoPrinter = {
      socket: null,
      PhotoPrinterConnectedCB: function () {},
      openCompletedCB: function () {},
      closeCompletedCB: function () {},
      printFileCompletedCB: function () {},
      cancelJobCompletedCB: function () {},
      clearQueueCompletedCB: function () {},
      connected: function (callback) {
        PhotoPrinterConnectedCB = callback;
        var that = this;
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
        that.socket = new WebSocket("ws://localhost:8083");
        that.socket.onopen = function () {
          new QWebChannel(that.socket, function (channel) {
            PhotoPrinterObject = channel.objects.officePrinter;
            PhotoPrinterObject.sig_opened.connect(function (return_code) {
              openCompletedCB(return_code);
            });
            PhotoPrinterObject.sig_closed.connect(function (return_code) {
              closeCompletedCB(return_code);
            });
            PhotoPrinterObject.sig_printed_file.connect(function (
              return_code,
              job_id
            ) {
              printFileCompletedCB(return_code, job_id, "print");
            });
            PhotoPrinterObject.sig_printed_status.connect(function (
              return_code,
              job_id
            ) {
              printFileCompletedCB(return_code, job_id, "printStatus");
            });
            PhotoPrinterObject.sig_canceled_job.connect(function (return_code) {
              cancelJobCompletedCB(return_code);
            });
            PhotoPrinterObject.sig_cleared_queue.connect(function (
              return_code
            ) {
              clearQueueCompletedCB(return_code);
            });
            if (typeof PhotoPrinterConnectedCB == "function") {
              PhotoPrinterConnectedCB();
            }
          });
        };
        that.socket.onclose = function () {
          console.log("serial board websocket disconnected.");
        };
      },
      open: function (callback) {
        openCompletedCB = callback;
        OfficePrinterObject.open(function (return_code) {
          if (0 != return_code) {
            openCompletedCB(return_code);
          }
        });
      },
      close: function (callback) {
        closeCompletedCB = callback;
        OfficePrinterObject.close(function (return_code) {
          if (0 != return_code) {
            closeCompletedCB(return_code);
          }
        });
      },
      printFile: function (file, callback) {
        printFileCompletedCB = callback;
        OfficePrinterObject.print_file(file, function (return_code) {
          if (0 != return_code) {
            printFileCompletedCB(return_code);
          }
        });
      },
      cancelJob: function (job_id, callback) {
        cancelJobCompletedCB = callback;
        OfficePrinterObject.cancel_job(job_id, function (return_code) {
          if (0 != return_code) {
            cancelJobCompletedCB(return_code);
          }
        });
      },
      clearQueue: function (callback) {
        clearQueueCompletedCB = callback;
        OfficePrinterObject.clear_queue(function (return_code) {
          if (0 != return_code) {
            clearQueueCompletedCB(return_code);
          }
        });
      },
    }),
    //通用摄像头
    (monocularCamera = {
      socket: null,
      monocularCameraConnectedCB: function () {},
      openedPreviewCompletedCB: function () {},
      closedPreviewCompletedCB: function () {},
      openVirtualCameraCompletedCB: function () {},
      closeVirtualCameraCompletedCB: function () {},
      tookPictureCompletedCB: function () {},
      connected: function (callback) {
        monocularCameraConnectedCB = callback;
        var that = this;
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
        that.socket = new WebSocket("ws://localhost:8083");
        that.socket.onopen = function () {
          new QWebChannel(that.socket, function (channel) {
            monocularCameraObject = channel.objects.monocularCamera;
            monocularCameraObject.sig_opened_preview.connect(function (
              return_code
            ) {
              openedPreviewCompletedCB(return_code);
            });
            monocularCameraObject.sig_closed_preview.connect(function (
              return_code
            ) {
              closedPreviewCompletedCB(return_code);
            });
            monocularCameraObject.sig_opened_virtual_camera.connect(function (
              return_code
            ) {
              openVirtualCameraCompletedCB(return_code);
            });
            monocularCameraObject.sig_closed_virtual_camera.connect(function (
              return_code
            ) {
              closeVirtualCameraCompletedCB(return_code);
            });
            monocularCameraObject.sig_took_picture.connect(function (
              return_code,
              imageData
            ) {
              tookPictureCompletedCB(return_code, imageData);
            });
            if (typeof monocularCameraConnectedCB == "function") {
              monocularCameraConnectedCB();
            }
          });
        };
        that.socket.onclose = function () {
          console.log("serial board websocket disconnected.");
        };
      },
      removes: function () {
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
      },
      openPreview: function (winX, winY, winW, winH, callback) {
        openedPreviewCompletedCB = callback;
        monocularCameraObject.open_preview(
          winX,
          winY,
          winW,
          winH,
          function (return_code) {
            if (0 != return_code) {
              openedPreviewCompletedCB(return_code);
            }
          }
        );
      },
      closePreview: function (callback) {
        closedPreviewCompletedCB = callback;
        monocularCameraObject.close_preview(function (return_code) {
          if (0 != return_code) {
            closedPreviewCompletedCB(return_code);
          }
        });
      },
      openVirtualCamera: function (image_w, image_h, callback) {
        openVirtualCameraCompletedCB = callback;
        monocularCameraObject.open_virtual_camera(
          image_w,
          image_h,
          function (return_code) {
            if (0 != return_code) {
              openVirtualCameraCompletedCB(return_code);
            }
          }
        );
      },
      closeVirtualCamera: function (callback) {
        closeVirtualCameraCompletedCB = callback;
        monocularCameraObject.close_virtual_camera(function (return_code) {
          if (0 != return_code) {
            closeVirtualCameraCompletedCB(return_code);
          }
        });
      },
      takePicture: function (image_w, image_h, format, callback) {
        tookPictureCompletedCB = callback;
        monocularCameraObject.take_picture(
          image_w,
          image_h,
          format,
          function (return_code) {
            if (0 != return_code) {
              tookPictureCompletedCB(return_code);
            }
          }
        );
      },
    }),
    //ups
    (upsEastEA300 = {
      socket: null,
      upsEastEA300ConnectedCB: function () {},
      openCompletedCB: function () {},
      closeCompletedCB: function () {},
      getWorkStatusCompletedCB: function () {},
      getFirmwareVersionCompletedCB: function () {},
      stopBuzzerAlarmCompletedCB: function () {},
      batteryDischargeTestCompletedCB: function () {},
      countdownShutdownCompletedCB: function () {},
      countdownShutdownAndDelayBootCompletedCB: function () {},
      clearCountdownSettingsCompletedCB: function () {},
      connected: function (callback) {
        upsEastEA300ConnectedCB = callback;
        var that = this;
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
        that.socket = new WebSocket("ws://localhost:8083");
        that.socket.onopen = function () {
          new QWebChannel(that.socket, function (channel) {
            upsEastEA300Object = channel.objects.uninterruptedPowerSupplyEA300;
            upsEastEA300Object.sig_opened.connect(function (return_code) {
              openCompletedCB(return_code);
            });
            upsEastEA300Object.sig_closed.connect(function (return_code) {
              closeCompletedCB(return_code);
            });
            upsEastEA300Object.sig_getted_firmware_version.connect(function (
              return_code,
              firmware
            ) {
              getFirmwareVersionCompletedCB(return_code, firmware);
            });
            upsEastEA300Object.sig_getted_work_status.connect(function (
              return_code,
              work_status
            ) {
              getWorkStatusCompletedCB(return_code, work_status);
            });
            upsEastEA300Object.sig_stopped_buzzer_alarm.connect(function (
              return_code
            ) {
              stopBuzzerAlarmCompletedCB(return_code);
            });
            upsEastEA300Object.sig_battery_discharge_test.connect(function (
              return_code
            ) {
              batteryDischargeTestCompletedCB(return_code);
            });
            upsEastEA300Object.sig_countdown_shutdown.connect(function (
              return_code
            ) {
              countdownShutdownCompletedCB(return_code);
            });
            upsEastEA300Object.sig_countdown_shutdown_and_delay_boot.connect(
              function (return_code) {
                countdownShutdownAndDelayBootCompletedCB(return_code);
              }
            );
            upsEastEA300Object.sig_canceled_countdown_shutdown.connect(
              function (return_code) {
                clearCountdownSettingsCompletedCB(return_code);
              }
            );

            if (typeof upsEastEA300ConnectedCB == "function") {
              upsEastEA300ConnectedCB();
            }
          });
        };
        that.socket.onclose = function () {
          console.log("serial board websocket disconnected.");
        };
      },
      open: function (callback) {
        openCompletedCB = callback;
        upsEastEA300Object.open(function (return_code) {
          if (0 != return_code) {
            openCompletedCB(return_code);
          }
        });
      },
      close: function (callback) {
        closeCompletedCB = callback;
        upsEastEA300Object.close(function (return_code) {
          if (0 != return_code) {
            closeCompletedCB(return_code);
          }
        });
      },
      getWorkStatus: function (callback) {
        getWorkStatusCompletedCB = callback;
        upsEastEA300Object.get_work_status(function (return_code) {
          if (0 != return_code) {
            getWorkStatusCompletedCB(return_code);
          }
        });
      },

      getFirmwareVersion: function (callback) {
        getFirmwareVersionCompletedCB = callback;
        upsEastEA300Object.get_firmware_version(function (return_code) {
          if (0 != return_code) {
            getFirmwareVersionCompletedCB(return_code);
          }
        });
      },

      stopBuzzerAlarm: function (callback) {
        stopBuzzerAlarmCompletedCB = callback;
        upsEastEA300Object.stop_buzzer_alarm(function (return_code) {
          if (0 != return_code) {
            stopBuzzerAlarmCompletedCB(return_code);
          }
        });
      },
      batteryDischargeTest: function (callback) {
        batteryDischargeTestCompletedCB = callback;
        upsEastEA300Object.battery_discharge_test(function (return_code) {
          if (0 != return_code) {
            batteryDischargeTestCompletedCB(return_code);
          }
        });
      },
      countdownShutdown: function (shutdown_time, callback) {
        countdownShutdownCompletedCB = callback;
        upsEastEA300Object.countdown_shutdown(
          shutdown_time,
          function (return_code) {
            if (0 != return_code) {
              countdownShutdownCompletedCB(return_code);
            }
          }
        );
      },
      countdownShutdownAndDelayBoot: function (
        shutdown_time,
        boot_time,
        callback
      ) {
        countdownShutdownAndDelayBootCompletedCB = callback;
        upsEastEA300Object.countdown_shutdown_and_delay_boot(
          shutdown_time,
          boot_time,
          function (return_code) {
            if (0 != return_code) {
              countdownShutdownAndDelayBootCompletedCB(return_code);
            }
          }
        );
      },
      clearCountdownSettings: function (callback) {
        clearCountdownSettingsCompletedCB = callback;
        upsEastEA300Object.cancel_countdown_shutdown(function (return_code) {
          if (0 != return_code) {
            clearCountdownSettingsCompletedCB(return_code);
          }
        });
      },
    }),
    //nfc阅读卡
    (nfcCardReader = {
      socket: null,
      nfcCardReaderConnectedCB: function () {},
      openCompletedCB: function () {},
      closeCompletedCB: function () {},
      readCardInformationCompletedCB: function () {},
      startCardStatusListenerCompletedCB: function () {},
      stopCardStatusListenerCompletedCB: function () {},
      connected: function (callback) {
        nfcCardReaderConnectedCB = callback;
        var that = this;
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
        that.socket = new WebSocket("ws://localhost:8083");
        that.socket.onopen = function () {
          new QWebChannel(that.socket, function (channel) {
            nfcCardReaderObject = channel.objects.nfcCardReaderACR122;
            nfcCardReaderObject.sig_opened.connect(function (return_code) {
              openCompletedCB(return_code);
            });
            nfcCardReaderObject.sig_closed.connect(function (return_code) {
              closeCompletedCB(return_code);
            });
            nfcCardReaderObject.sig_read_card_information.connect(function (
              return_code
            ) {
              readCardInformationCompletedCB(return_code);
            });
            nfcCardReaderObject.sig_getted_card_information.connect(function (
              return_code,
              cardNumber
            ) {
              readCardInformationCompletedCB(return_code, cardNumber);
            });
            nfcCardReaderObject.sig_started_card_status_listener.connect(
              function (return_code) {
                startCardStatusListenerCompletedCB(return_code);
              }
            );
            nfcCardReaderObject.sig_card_entered.connect(function (
              return_code,
              card_num
            ) {
              startCardStatusListenerCompletedCB(return_code, card_num, "in");
            });
            nfcCardReaderObject.sig_card_leaved.connect(function (
              return_code,
              card_num
            ) {
              startCardStatusListenerCompletedCB(return_code, card_num, "lev");
            });
            nfcCardReaderObject.sig_stopped_card_status_listener.connect(
              function (return_code, card_num) {
                stopCardStatusListenerCompletedCB(return_code, card_num);
              }
            );

            if (typeof nfcCardReaderConnectedCB == "function") {
              nfcCardReaderConnectedCB();
            }
          });
        };
        that.socket.onclose = function () {
          console.log("serial board websocket disconnected.");
        };
      },
      removes: function () {
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
      },
      open: function (callback) {
        openCompletedCB = callback;
        nfcCardReaderObject.open(function (return_code) {
          if (0 != return_code) {
            openCompletedCB(return_code);
          }
        });
      },
      close: function (callback) {
        closeCompletedCB = callback;
        nfcCardReaderObject.close(function (return_code) {
          if (0 != return_code) {
            closeCompletedCB(return_code);
          }
        });
      },
      readCardInformation: function (callback) {
        readCardInformationCompletedCB = callback;
        nfcCardReaderObject.read_card_information(function (return_code) {
          if (0 != return_code) {
            readCardInformationCompletedCB(return_code);
          }
        });
      },
      startCardStatusListener: function (callback) {
        startCardStatusListenerCompletedCB = callback;
        nfcCardReaderObject.start_card_status_listener(function (return_code) {
          if (0 != return_code) {
            startCardStatusListenerCompletedCB(return_code);
          }
        });
      },
      stopCardStatusListener: function (callback) {
        stopCardStatusListenerCompletedCB = callback;
        nfcCardReaderObject.stop_card_status_listener(function (return_code) {
          if (0 != return_code) {
            stopCardStatusListenerCompletedCB(return_code);
          }
        });
      },
    }),
    //语音识别
    (SpeechRecognize = {
      socket: null,
      SpeechRecognizeConnectedCB: function () {},
      startRecordCompletedCB: function () {},
      stopRecordCompletedCB: function () {},
      speechToTextCompletedCB: function () {},
      textToSpeechCompletedCB: function () {},
      connected: function (callback) {
        SpeechRecognizeConnectedCB = callback;
        var that = this;
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
        that.socket = new WebSocket("ws://localhost:8090");
        that.socket.onopen = function () {
          new QWebChannel(that.socket, function (channel) {
            SpeechRecognizeBdObject = channel.objects.speechRecognizeBd;
            SpeechRecognizeBdObject.sig_start_record_completed.connect(
              function (return_code) {
                console.log("开始录音。。。");
                startRecordCompletedCB(return_code);
              }
            );
            SpeechRecognizeBdObject.sig_stop_record_completed.connect(function (
              return_code,
              speech_path
            ) {
              console.log("停止录音。。。");
              stopRecordCompletedCB(return_code, speech_path);
            });
            SpeechRecognizeBdObject.sig_speech_to_text_completed.connect(
              function (return_code, text) {
                console.log("语音转文字。。。");
                speechToTextCompletedCB(return_code, wordString);
              }
            );
            SpeechRecognizeBdObject.sig_text_to_speech_completed.connect(
              function (return_code, speech_path) {
                console.log("文字转语音。。。");
                textToSpeechCompletedCB(return_code, speech_path);
              }
            );

            if (typeof SpeechRecognizeConnectedCB == "function") {
              SpeechRecognizeConnectedCB();
            }
          });
        };
        that.socket.onclose = function () {
          console.log("serial board websocket disconnected.");
        };
      },
      startRecord: function (speech_path, callback) {
        startRecordCompletedCB = callback;
        speechRecogBdObject.start_record(speech_path, function (return_code) {
          if (0 != return_code) {
            startRecordCompletedCB(return_code);
          }
        });
      },
      stopRecord: function (callback) {
        stopRecordCompletedCB = callback;
        speechRecogBdObject.stop_record(function (return_code) {
          if (0 != return_code) {
            stopRecordCompletedCB(return_code);
          }
        });
      },
      speechToText: function (speech_path, callback) {
        speechToTextCompletedCB = callback;
        speechRecogBdObject.speech_to_text(speech_path, function (return_code) {
          if (0 != return_code) {
            speechToTextCompletedCB(return_code);
          }
        });
      },
      textToSpeech: function (text, speech_path, callback) {
        textToSpeechCompletedCB = callback;
        speechRecogBdObject.text_to_speech(
          text,
          speech_path,
          function (return_code) {
            if (0 != return_code) {
              textToSpeechCompletedCB(return_code);
            }
          }
        );
      },
    }),
    //指纹识别
    (fingerreader = {
      socket: null,
      fingerreaderConnectedCB: function () {},
      initFingerPrintRecognizeCompletedCB: function () {},
      uninitFingerPrintRecognizeCompletedCB: function () {},
      recordFingerPrintCompletedCB: function () {},
      deleteFingerPrintCompletedCB: function () {},
      checkFingerPrintExistCompletedCB: function () {},
      getUserIdAliasCompletedCB: function () {},
      getFingerPrintCountCompletedCB: function () {},
      resetFingerPrintDatabaseCompletedCB: function () {},
      fingerPrintRecognizeCompletedCB: function () {},
      getFingerPrintFeatureInDatabaseCompletedCB: function () {},
      addFingerPrintToDatabaseCompletedCB: function () {},
      fingerPrintFeatureRecognizeCompletedCB: function () {},
      enableCheckPressCompletedCB: function () {},
      disableCheckPressCompletedCB: function () {},
      connected: function (callback) {
        fingerreaderConnectedCB = callback;
        var that = this;
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
        that.socket = new WebSocket("ws://localhost:8099");
        that.socket.onopen = function () {
          new QWebChannel(that.socket, function (channel) {
            fingereaderobject = channel.objects.EyeCoolFingerPrintInstrument;
            fingereaderobject.sig_init_finger_print_recognize_completed.connect(
              function (return_code) {
                initFingerPrintRecognizeCompletedCB(return_code);
              }
            );
            fingereaderobject.sig_uninit_finger_print_recognize_completed.connect(
              function (return_code) {
                uninitFingerPrintRecognizeCompletedCB(return_code);
              }
            );
            fingereaderobject.sig_record_finger_print_completed.connect(
              function (return_code) {
                recordFingerPrintCompletedCB(return_code);
              }
            );
            fingereaderobject.sig_report_record_finger_print_result.connect(
              function (return_code) {
                recordFingerPrintCompletedCB(return_code, "report");
              }
            );

            fingereaderobject.sig_delete_finger_print_completed.connect(
              function (return_code) {
                deleteFingerPrintCompletedCB(return_code);
              }
            );
            fingereaderobject.sig_check_finger_print_exist_completed.connect(
              function (return_code, bool) {
                checkFingerPrintExistCompletedCB(return_code, bool);
              }
            );
            fingereaderobject.sig_get_user_id_alias_completed.connect(function (
              return_code,
              alias
            ) {
              getUserIdAliasCompletedCB(return_code, alias);
            });
            fingereaderobject.sig_get_finger_print_count_completed.connect(
              function (return_code, finger_print_count) {
                getFingerPrintCountCompletedCB(return_code, finger_print_count);
              }
            );
            fingereaderobject.sig_reset_finger_print_database_completed.connect(
              function (return_code) {
                resetFingerPrintDatabaseCompletedCB(return_code);
              }
            );
            fingereaderobject.sig_finger_print_recognize_completed.connect(
              function (return_code) {
                fingerPrintRecognizeCompletedCB(return_code);
              }
            );
            fingereaderobject.sig_report_finger_print_recognize_result.connect(
              function (return_code, user_id, alias) {
                fingerPrintRecognizeCompletedCB(return_code, user_id, alias);
              }
            );
            fingereaderobject.sig_get_finger_print_feature_in_database_completed.connect(
              function (return_code, feature_base64) {
                getFingerPrintFeatureInDatabaseCompletedCB(
                  return_code,
                  feature_base64
                );
              }
            );
            fingereaderobject.sig_add_finger_print_to_database_completed.connect(
              function (return_code) {
                addFingerPrintToDatabaseCompletedCB(return_code);
              }
            );
            fingereaderobject.sig_finger_print_feature_recognize_completed.connect(
              function (return_code) {
                fingerPrintFeatureRecognizeCompletedCB(return_code);
              }
            );
            fingereaderobject.sig_report_finger_print_feature_recognize_result.connect(
              function (return_code, user_id, alias) {
                fingerPrintFeatureRecognizeCompletedCB(
                  return_code,
                  user_id,
                  alias
                );
              }
            );
            fingereaderobject.sig_enable_check_press_completed.connect(
              function (return_code) {
                enableCheckPressCompletedCB(return_code);
              }
            );
            fingereaderobject.sig_report_finger_pressed.connect(function (
              return_code,
              status
            ) {
              enableCheckPressCompletedCB(return_code, status);
            });
            fingereaderobject.sig_disable_check_press_completed.connect(
              function (return_code) {
                disableCheckPressCompletedCB(return_code);
              }
            );
            if (typeof fingerreaderConnectedCB == "function") {
              fingerreaderConnectedCB();
            }
          });
        };
      },
      removes: function () {
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
      },
      initFingerPrintRecognize: function (callback) {
        initFingerPrintRecognizeCompletedCB = callback;
        fingereaderobject.init_finger_print_recognize(function (return_code) {
          if (0 != return_code) {
            initFingerPrintRecognizeCompletedCB(return_code);
          }
        });
      },
      uninitFingerPrintRecognize: function (callback) {
        uninitFingerPrintRecognizeCompletedCB = callback;
        fingereaderobject.uninit_finger_print_recognize(function (return_code) {
          if (0 != return_code) {
            uninitFingerPrintRecognizeCompletedCB(return_code);
          }
        });
      },
      recordFingerPrint: function (user_id, finger_id, callback) {
        recordFingerPrintCompletedCB = callback;
        fingereaderobject.record_finger_print(
          user_id,
          finger_id,
          function (return_code) {
            if (0 != return_code) {
              recordFingerPrintCompletedCB(return_code);
            }
          }
        );
      },
      deleteFingerPrint: function (user_id, alias, callback) {
        deleteFingerPrintCompletedCB = callback;
        fingereaderobject.delete_finger_print(
          user_id,
          alias,
          function (return_code) {
            if (0 != return_code) {
              deleteFingerPrintCompletedCB(return_code);
            }
          }
        );
      },
      checkFingerPrintExist: function (user_id, alias, callback) {
        checkFingerPrintExistCompletedCB = callback;
        fingereaderobject.check_finger_print_exist(
          user_id,
          alias,
          function (return_code) {
            if (0 != return_code) {
              checkFingerPrintExistCompletedCB(return_code);
            }
          }
        );
      },
      getUserIdAlias: function (user_id, callback) {
        getUserIdAliasCompletedCB = callback;
        fingereaderobject.get_user_id_alias(user_id, function (return_code) {
          if (0 != return_code) {
            getUserIdAliasCompletedCB(return_code);
          }
        });
      },
      getFingerPrintCount: function (callback) {
        getFingerPrintCountCompletedCB = callback;
        fingereaderobject.get_finger_print_count(function (return_code) {
          if (0 != return_code) {
            getFingerPrintCountCompletedCB(return_code);
          }
        });
      },
      resetFingerPrintDatabase: function (callback) {
        resetFingerPrintDatabaseCompletedCB = callback;
        fingereaderobject.reset_finger_print_database(function (return_code) {
          if (0 != return_code) {
            resetFingerPrintDatabaseCompletedCB(return_code);
          }
        });
      },
      fingerPrintRecognize: function (callback) {
        fingerPrintRecognizeCompletedCB = callback;
        fingereaderobject.finger_print_recognize(function (return_code) {
          if (0 != return_code) {
            fingerPrintRecognizeCompletedCB(return_code);
          }
        });
      },
      getFingerPrintFeatureInDatabase: function (user_id, alias, callback) {
        //查询剩余内存
        getFingerPrintFeatureInDatabaseCompletedCB = callback;
        fingereaderobject.get_finger_print_feature_in_database(
          user_id,
          alias,
          function (return_code) {
            if (0 != return_code) {
              getFingerPrintFeatureInDatabaseCompletedCB(return_code);
            }
          }
        );
      },
      addFingerPrintToDatabase: function (
        user_id,
        alias,
        feature_base64,
        callback
      ) {
        //录入指纹仪
        addFingerPrintToDatabaseCompletedCB = callback;
        fingereaderobject.add_finger_print_to_database(
          user_id,
          alias,
          feature_base64,
          function (return_code) {
            if (0 != return_code) {
              addFingerPrintToDatabaseCompletedCB(return_code);
            }
          }
        );
      },
      fingerPrintFeatureRecognize: function (feature_base64, callback) {
        //查找用户
        fingerPrintFeatureRecognizeCompletedCB = callback;
        fingereaderobject.finger_print_feature_recognize(
          feature_base64,
          function (return_code) {
            if (0 != return_code) {
              fingerPrintFeatureRecognizeCompletedCB(return_code);
            }
          }
        );
      },
      enableCheckPress: function (callback) {
        //删除用户
        enableCheckPressCompletedCB = callback;
        fingereaderobject.enable_check_press(function (return_code) {
          if (0 != return_code) {
            enableCheckPressCompletedCB(return_code);
          }
        });
      },

      disableCheckPress: function (callback) {
        //读取指纹特征码
        disableCheckPressCompletedCB = callback;
        fingereaderobject.disable_check_press(function (return_code) {
          if (0 != return_code) {
            disableCheckPressCompletedCB(return_code);
          }
        });
      },
    }),
    //华视身份证阅读器
    (idcardreaderCVR = {
      socket: null,
      idcardReaderCVRConnectedCB: function () {},
      openCompletedCB: function () {},
      closeCompletedCB: function () {},
      getDeviceStatusCompletedCB: function () {},
      getSecurityModuleNumberCompletedCB: function () {},
      readCardInformationCompletedCB: function () {},
      startCardInformationListenerCompletedCB: function () {},
      stopCardInformationListenerCompletedCB: function () {},
      connected: function (callback) {
        idcardReaderCVRConnectedCB = callback;
        var that = this;
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
        that.socket = new WebSocket("ws://localhost:8083");
        that.socket.onopen = function () {
          new QWebChannel(that.socket, function (channel) {
            idcardReaderCVRObject = channel.objects.idCardReaderCVR100N;
            idcardReaderCVRObject.sig_opened.connect(function (return_code) {
              openCompletedCB(return_code);
            });
            idcardReaderCVRObject.sig_closed.connect(function (return_code) {
              closeCompletedCB(return_code);
            });
            idcardReaderCVRObject.sig_getted_device_status.connect(function (
              return_code,
              status
            ) {
              getDeviceStatusCompletedCB(return_code, status);
            });
            idcardReaderCVRObject.sig_getted_security_module_number.connect(
              function (return_code, number) {
                getSecurityModuleNumberCompletedCB(return_code, number);
              }
            );
            idcardReaderCVRObject.sig_read_card_information.connect(function (
              return_code
            ) {
              readCardInformationCompletedCB(return_code);
            });
            idcardReaderCVRObject.sig_read_id_card_information.connect(
              function (return_code, info) {
                readCardInformationCompletedCB(
                  return_code,
                  info,
                  "secondGeneration"
                );
              }
            );
            idcardReaderCVRObject.sig_read_foreign_card_information.connect(
              function (return_code, info) {
                readCardInformationCompletedCB(
                  return_code,
                  info,
                  "residenceOfForeigners"
                );
              }
            );
            idcardReaderCVRObject.sig_read_gat_card_information.connect(
              function (return_code, info) {
                readCardInformationCompletedCB(
                  return_code,
                  info,
                  "residencePermit"
                );
              }
            );
            idcardReaderCVRObject.sig_started_card_information_listener.connect(
              function (return_code) {
                startCardInformationListenerCompletedCB(return_code);
              }
            );
            idcardReaderCVRObject.sig_getted_id_card_information.connect(
              function (return_code, info) {
                startCardInformationListenerCompletedCB(
                  return_code,
                  info,
                  "secondGenerationListener"
                );
              }
            );
            idcardReaderCVRObject.sig_getted_foreign_card_information.connect(
              function (return_code, info) {
                startCardInformationListenerCompletedCB(
                  return_code,
                  info,
                  "residenceOfForeignersListener"
                );
              }
            );
            idcardReaderCVRObject.sig_getted_gat_card_information.connect(
              function (return_code, info) {
                startCardInformationListenerCompletedCB(
                  return_code,
                  info,
                  "residencePermitListener"
                );
              }
            );
            idcardReaderCVRObject.sig_stopped_card_information_listener.connect(
              function (return_code) {
                stoppedCardInformationListenerCompletedCB(return_code);
              }
            );

            if (typeof idcardReaderCVRConnectedCB == "function") {
              idcardReaderCVRConnectedCB();
            }
          });
        };
        that.socket.onclose = function () {
          console.log("serial board websocket disconnected.");
        };
      },
      removes: function () {
        if (this.socket != null) {
          if (0 != this.socket.readyState) {
            this.socket.close();
          }
        }
      },
      open: function (callback) {
        openCompletedCB = callback;
        idcardReaderCVRObject.open(function (return_code) {
          if (0 != return_code) {
            openCompletedCB(return_code);
          }
        });
      },
      close: function (callback) {
        closeCompletedCB = callback;
        idcardReaderCVRObject.close(function (return_code) {
          if (0 != return_code) {
            closeCompletedCB(return_code);
          }
        });
      },
      getDeviceStatus: function (callback) {
        getDeviceStatusCompletedCB = callback;
        idcardReaderCVRObject.get_device_status(function (return_code) {
          if (0 != return_code) {
            getDeviceStatusCompletedCB(return_code);
          }
        });
      },
      getSecurityModuleNumber: function (callback) {
        getSecurityModuleNumberCompletedCB = callback;
        idcardReaderCVRObject.get_security_module_number(function (
          return_code
        ) {
          if (0 != return_code) {
            getSecurityModuleNumberCompletedCB(return_code);
          }
        });
      },

      readCardInformation: function (callback) {
        readCardInformationCompletedCB = callback;
        idcardReaderCVRObject.read_card_information(function (return_code) {
          if (0 != return_code) {
            readCardInformationCompletedCB(return_code);
          }
        });
      },
      startCardInformationListener: function (callback) {
        startCardInformationListenerCompletedCB = callback;
        idcardReaderCVRObject.start_card_information_listener(function (
          return_code
        ) {
          if (0 != return_code) {
            startCardInformationListenerCompletedCB(return_code);
          }
        });
      },
      stoppedCardInformationListener: function (callback) {
        stoppedCardInformationListenerCompletedCB = callback;
        idcardReaderCVRObject.stop_card_information_listener(function (
          return_code
        ) {
          if (0 != return_code) {
            stoppedCardInformationListenerCompletedCB(return_code);
          }
        });
      },
    });
}
