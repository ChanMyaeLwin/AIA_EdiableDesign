function htmlDecode(data){
    var txt=document.createElement('textarea');
    txt.innerHTML=data;
    return txt.value
}

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $('.select-all').click(function () {
        let $select2 = $(this).parent().siblings('.select2');
        $select2.find('option').prop('selected', 'selected');
        $select2.trigger('change')
    });
    $('.deselect-all').click(function () {
        let $select2 = $(this).parent().siblings('.select2');
        $select2.find('option').prop('selected', '');
        $select2.trigger('change')
    });

    $('.select2').select2({
        theme: "classic",
        // placeholder: "Select",
        // allowClear: true
    });



    $('#staff_list').DataTable({
        bSort: false,
        ordering: false,
        processing: true,
        serverSide: true,
        deferRender: true,
        targets: 'no-sort',
        ajax: {
            url: "/admin/users"
        },
        columns: [
            {data: 'DT_RowIndex', name: 'DT_RowIndex'},
            {data: 'email', name: 'email', searchable: true},
            {data: 'role', name: 'role', searchable: true},
            {
                data: 'status',
                name: 'status',
                render: function(data, type, row, meta) {
                    let status = '---';

                    if (data.status === true) {
                        status = `<label class="switch"><input type="checkbox" onclick="adminStatusUpdate(this)" id="${row.uuid}" ${data.checked}/>
                            <span class="slider round"></span></label>`
                    }

                    return status;
                }
            },
            {
                data: 'actions',
                name: 'actions',
                render: function(data, type, row, meta) {
                    let actions = '';
                    if (data.canEdit === true) {
                        actions += `<a class="btn btn-primary" href="/admin/users/${row.uuid}/edit"><i class="fas fa-edit"></i></a>`
                    }

                    if (data.canDelete === true) {
                        actions += `&nbsp;<a class="btn btn-primary" href="#" onclick="destroy(this, 'users')" id="${row.uuid}"><i class="fas fa-times"></i></a>`
                    }

                    if (actions.length !== 0) {
                        return actions;
                    }

                    return '---';
                }
            },
        ],
        "columnDefs": [
            {"searchable": false}
        ]
    });

    $('#role_list').DataTable({
        bSort: false,
        ordering: false,
        processing: true,
        serverSide: true,
        deferRender: true,
        targets: 'no-sort',
        ajax: {
            url: "/admin/roles"
        },
        columns: [
            {data: 'DT_RowIndex', name: 'DT_RowIndex'},
            {data: 'name', name: 'name', searchable: true},
            {
                data: 'permissions',
                name: 'permissions',
                searchable: true,
                render: function (data) {
                    let badges = '---';
                    if (data.permissions) {
                        badges = '';
                        var permissions = data.permissions;
                        $(permissions).each(function (key, value) {
                            badges += `<span class='badge badge-info'>${value}</span>&nbsp;`;
                        })

                        return badges;
                    }
                }
            },
            {
                data: 'actions',
                name: 'actions',
                render: function (data, type, row) {
                    let actions = '';
                    if (data.canEdit) {
                        actions += `<a class="btn btn-primary" href="/admin/roles/${row.uuid}/edit"><i class="fas fa-edit"></i></a>`;
                    }

                    if (data.canDelete) {
                        actions += `&nbsp;<a class="btn btn-primary" href="#" onclick="destroy(this, 'roles')" id="${row.uuid}"><i class="fas fa-times"></i></a>`
                    }

                    if (actions.length !== 0) {
                        return actions;
                    }

                    return '---';
                }
            },
        ],
        "columnDefs": [
            {"searchable": false}
        ]
    })

    const checkbox = '#inline-check';
    $(checkbox).on('change', function() {
        if (this.checked) {
            $("#country-div").removeClass('d-none');

        } else {
            $("#country-div").addClass('d-none');

        }
    });

    $("#is-change").on('change', function() {
        if (this.checked) {
            $('#password-div').removeClass('d-none');
        } else {
            $('#password-div').addClass("d-none");
        }
    });

    $('#reset').on('click', function() {
        location.reload();
    });

    /* claim list */
    $('#claim_list').DataTable({
        "ordering": true,
        "processing": true,
        "serverSide": true,
        "deferRender": true,
        "targets": 'no-sort',
        "bSort": true,
        "order": [],
        'ajax': {
            'url': "/admin/claim_list",
        },
        columns: [
            {data: 'DT_RowIndex', orderable: false},
            {data: 'policy_no',name: 'policy_no',orderable: false},
            {
                data: 'action1',
                name: 'action1',
                orderable: false,
                render: function(data, type, row) {
                    return `<a href="/admin/claim_list/detail/${row.uuid}" class="claim_list">${data}</a>`
                }
            },
            {data: 'phone_no',orderable: false},
            {data: 'claim_types',name: 'claim_types',orderable: false},
            {data: 'created_at',name: 'created_at'},
            {data: 'status',name: 'status'},
            {data: 'time_diff',name: 'time_diff'},
            {data: 'count_down',name: 'count_down'},


        ],
        "columnDefs": [{
            // "targets": [2, 2, 3],
            "searchable": false
        }]
    })
    /* policy listing */
   table= $('#policy_list').DataTable({
        "ordering": true,
        "processing": true,
        "serverSide": true,
        "deferRender": true,
        "targets": 'no-sort',
        "bSort": true,
        "order": [],
        'ajax': {
            'url': "/admin/policy-list",
        },
        columns: [
            {data: 'DT_RowIndex',orderable: false},
            {data: 'insured_name',name: 'insured_name'},
            {data: 'nrc_detail',name: 'nrc_detail'},
            {data: 'passport',name: 'passport'},
            {data: 'other',name: 'other'},
            {data: 'policy_no',name: 'policy_no'},
            {data: 'client_no',name: 'client_no'},
            {data: 'number_of_unit',name: 'number_of_unit'},
            {data: 'product_type',name: 'product_type'},


        ],
        "columnDefs": [{
            // "targets": [2, 2, 3],
            "searchable": false
        }]
    })

    $('#policy_list_filter input').unbind();
    $('#policy_list_filter input').bind('keyup', function (e) {
        if (e.keyCode == 13) {
            table.search(this.value).draw();
        }
    });

    /* permissioon */
    $('#permission').DataTable({
        "ordering": false,
        "processing": true,
        "serverSide": true,
        "deferRender": true,
        "targets": 'no-sort',
        "bSort": false,
        "order": [],
        'ajax': {
            'url': "/admin/permissions",
        },
        columns: [
            {data: 'DT_RowIndex'},
            {data: 'name', searchable: true},
        ],
    });
    /* member listing */
    memberTable=$('#member_list').DataTable({
        "ordering": true,
        "processing": true,
        "serverSide": true,
        "deferRender": true,
        "targets": 'no-sort',
        "bSort": true,
        "order": [],
        'ajax': {
            'url': "/admin/member-list",
        },
        columns: [
            {data: 'DT_RowIndex',orderable: false},
            {data: 'name'},
            {data: 'phone_no'},
            {data: 'nrc_detail'},
            {data: 'passport'},
            {data: 'other'},
            {data: 'client_no'},
            {data: 'email'},
            {data: 'is_vip',name: 'is_vip'},
            {data: 'created_at'},
            {data: 'active_date'},

        ],
        "columnDefs": [{
            // "targets": [2, 2, 3],
            "searchable": false
        }]
    })

    $('#member_list_filter input').unbind();
    $('#member_list_filter input').bind('keyup', function (e) {
        if (e.keyCode == 13) {
            memberTable.search(this.value).draw();
        }
    });


    $('#claim_update').submit(function (event) {
        const is_update = parseInt($('#update').val());
        const value = parseInt($("#claim_status").val());
        const is_disable = $('#claim_status').is(':disabled');
        if (value === 4 && !is_disable && is_update === 0) {
            event.preventDefault();
            swal.fire({
                width: '300px',
                title: "Are You Sure?",
                showCancelButton: true,
                confirmButtonText: "Yes",
                cancelButtonText: "No",
                confirmButtonColor: 'red',
                closeOnConfirm: false
            }).then((isConfirm) => {
                if (isConfirm.value) {
                    $('#update').val('1')
                    $('#claim_update').submit();
                }
            });
        }
    })


    //logout form
    $('#logout').on('click',function(event){
            event.preventDefault();
            document.querySelector('#admin-logout-form').submit();
    })
});

function adminStatusUpdate(ele) {
    let status;
    let input_id = $(ele).attr("id");
    $(ele).prop('disabled', true);
    if ($(ele).prop('checked')) {
        status = 1;
    } else {
        status = 0;
    }

    $.ajax({
        method: 'put',
        url: '/admin/users/' + input_id,
        data: {'status': status}
    }).done(function (response) {
        if (response.success === 1) {
            $('#' + input_id).prop('disabled', false);
        }
    })
}

function destroy(ele, key) {
    let input_id = $(ele).attr('id');
    swal.fire({
        title: "Are you sure?",
        text: "Your will not be able to recover this action!",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: 'red',
        closeOnConfirm: false
    }).then((result) => {
        if (result.value) {
            $.ajax({
                method: 'delete',
                url: '/admin/'+ key + '/' + input_id,
            }).done(function (response) {
                if (response.status === 1) {
                    location.reload();
                } else {
                    failAlert(key);
                }
            })
        }
    })
}

function failAlert($key) {
    let message = "Fail to delete";
    if ($key === "roles") {
        message = "Please delete staff first! <br> This role is already used at some staff.";
    }

    swal.fire({
        html: message,
        title: "Fail",
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "Close",
        closeOnConfirm: false
    })
}
  //close the alert after 3 seconds.
  $(document).ready(function () {
    setTimeout(function () {
        $(".alert").alert('close');
    }, 3000)
});





