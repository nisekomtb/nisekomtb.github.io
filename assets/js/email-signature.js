/* NAMBA email signature generator.
   Reads window.NAMBA_TEAM / window.NAMBA_STAFF (dumped via Jekyll jsonify),
   derives each person's English signature role lines, renders the canonical
   light signature, and copies it as rich HTML for pasting into Gmail. */
(function () {
  'use strict';

  var SITE = 'https://namba.ngo';
  var team = (window.NAMBA_TEAM || []);
  var staff = (window.NAMBA_STAFF || []);

  // --- Build the people list with derived EN role lines ---------------------
  function roleLines(member, group) {
    if (member.sig_roles && member.sig_roles.length) {
      return member.sig_roles.slice();
    }
    var lines = [];
    if (member.cofounder) { lines.push('Co-founder'); }
    var role = member.namba_role;
    if (!role && group === 'board') { role = 'Director'; }
    // Bare Directors show "Director" plus their sub-committee on a separate line;
    // people with a specific role (Head of X, Officer, Auditor, President/VP) do not.
    if (role === 'Director' && member.committee) {
      lines.push('Director');
      lines.push(member.committee + ' Subcommittee');
    } else if (role) {
      lines.push(role);
    }
    return lines;
  }

  function classify(member) {
    if (member.leader) { return 'leader'; }
    if (member.cofounder) { return 'cofounder'; }
    return 'board';
  }

  var people = [];
  team.forEach(function (m, i) {
    var group = classify(m);
    people.push({
      key: 'team-' + i,
      group: group,
      name: m.name,
      jaName: (m.ja && m.ja.name) || m.name,
      image: m.image,
      lines: roleLines(m, group)
    });
  });
  staff.forEach(function (m, i) {
    people.push({
      key: 'staff-' + i,
      group: 'staff',
      name: m.name,
      jaName: (m.ja && m.ja.name) || m.name,
      image: m.image,
      lines: roleLines(m, 'staff')
    });
  });

  people.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  // --- Signature HTML (canonical light template) ----------------------------
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function absImage(path) {
    return /^https?:/.test(path) ? path : SITE + path;
  }

  function signatureHtml(p) {
    var roleHtml = p.lines.map(function (line) {
      return '<div style="font-size:13px; color:#555555;">' + escapeHtml(line) + '</div>';
    }).join('');
    // First role line gets top padding to separate it from the name block.
    roleHtml = roleHtml.replace(
      'color:#555555;">',
      'color:#555555; padding-top:6px;">'
    );

    return '' +
'<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse; max-width:600px;">' +
  '<tr>' +
    '<td bgcolor="#ffffff" style="background:#ffffff; border:1px solid #e6e2dc; border-radius:10px; padding:22px 24px;">' +
      '<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse; font-family:Arial,Helvetica,sans-serif; color:#1a1a1a;">' +
        '<tr>' +
          '<td valign="middle" style="padding:0 18px 0 0;">' +
            '<img src="' + absImage(p.image) + '" alt="' + escapeHtml(p.name) + '" width="84" height="84" style="display:block; width:84px; height:84px; border-radius:50%; border:3px solid #d4a843; object-fit:cover;">' +
          '</td>' +
          '<td valign="middle" style="padding:0 16px 0 0; line-height:1.3;">' +
            '<div style="font-size:18px; font-weight:bold; color:#b34f24; letter-spacing:0.2px;">' + escapeHtml(p.name) + '</div>' +
            '<div style="font-size:13px; color:#1a1a1a; padding-top:2px;">' + escapeHtml(p.jaName) + '</div>' +
            roleHtml +
            '<div style="font-size:13px; line-height:1.6; padding-top:12px;">' +
              '<a href="https://namba.ngo" style="color:#b34f24; text-decoration:none; font-weight:bold; white-space:nowrap;">namba.ngo</a>' +
              '<span style="color:#d4a843; padding:0 7px;">&middot;</span>' +
              '<a href="https://www.instagram.com/nisekomtb" style="color:#b34f24; text-decoration:none; white-space:nowrap;">Instagram</a>' +
              '<span style="color:#d4a843; padding:0 7px;">&middot;</span>' +
              '<a href="https://www.facebook.com/nisekoareamtbassociation" style="color:#b34f24; text-decoration:none; white-space:nowrap;">Facebook</a>' +
            '</div>' +
          '</td>' +
          '<td valign="middle" style="padding:0 16px 0 0;">' +
            '<table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr><td style="width:2px; height:96px; background:#d4a843; font-size:0; line-height:0;">&nbsp;</td></tr></table>' +
          '</td>' +
          '<td valign="middle">' +
            '<a href="https://namba.ngo" style="text-decoration:none; border:0;">' +
              '<img src="' + SITE + '/assets/images/logos/email-logo.png" alt="NAMBA, Niseko Area Mountain Bike Association" width="150" height="87" style="display:block; width:150px; height:87px; border:0;">' +
            '</a>' +
          '</td>' +
        '</tr>' +
      '</table>' +
    '</td>' +
  '</tr>' +
'</table>';
  }

  // --- Wire up the DOM ------------------------------------------------------
  var select = document.getElementById('sig-person');
  var preview = document.getElementById('sig-preview');
  var copyBtn = document.getElementById('sig-copy');
  var status = document.getElementById('sig-status');
  if (!select || !preview || !copyBtn) { return; }

  people.forEach(function (p) {
    var opt = document.createElement('option');
    opt.value = p.key;
    opt.textContent = p.name;
    select.appendChild(opt);
  });

  function current() {
    return people.filter(function (p) { return p.key === select.value; })[0];
  }

  function render() {
    var p = current();
    if (!p) { preview.innerHTML = ''; copyBtn.disabled = true; return; }
    preview.innerHTML = signatureHtml(p);
    copyBtn.disabled = false;
    if (status) { status.textContent = ''; }
  }

  select.addEventListener('change', render);

  copyBtn.addEventListener('click', function () {
    var p = current();
    if (!p) { return; }
    var html = signatureHtml(p);
    var plain = p.name + '\n' + p.jaName + '\n' + p.lines.join('\n') +
      '\nnamba.ngo | Instagram | Facebook';

    function done() {
      if (status) { status.style.color = '#2e7d32'; status.textContent = 'Copied! Paste into Gmail (see steps below).'; }
    }
    function failed() {
      if (status) { status.style.color = '#b34f24'; status.textContent = 'Copy failed. Select the preview manually and press Cmd/Ctrl+C.'; }
    }
    function fallback() {
      var range = document.createRange();
      range.selectNode(preview.firstChild);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      try { document.execCommand('copy'); done(); }
      catch (e) { failed(); }
      sel.removeAllRanges();
    }

    if (navigator.clipboard && window.ClipboardItem) {
      var item = new window.ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plain], { type: 'text/plain' })
      });
      navigator.clipboard.write([item]).then(done).catch(fallback);
    } else {
      fallback();
    }
  });

  render();
})();
